<?php

namespace App\Http\Controllers\Api;

use App\Enums\ServiceType;
use App\Models\Service;
use App\Models\ServiceFaq;
use App\Models\ServiceFeature;
use App\Models\ServiceProcessStep;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class ServiceController extends BaseController
{
    protected $model = Service::class;

    protected $searchableFields = ['name', 'slug', 'short_name'];

    protected $sortableFields = ['id', 'name', 'slug', 'sort_order', 'status', 'created_at'];

    protected $defaultSortField = 'sort_order';

    protected $defaultSortDirection = 'asc';

    protected $relationships = ['parent', 'children', 'features', 'processSteps', 'faqs'];

    protected $validationRules = [];

    public function __construct()
    {
        $this->validationRules = [
            'store' => $this->baseRules(),
            'update' => $this->baseRules(isUpdate: true),
        ];
    }

    public function index(Request $request)
    {
        $query = Service::query()->with(['parent', 'children']);

        $query = $this->applyApiFilters(
            $query,
            $request,
            $this->searchableFields,
            $this->sortableFields,
            $this->defaultSortField,
            $this->defaultSortDirection
        );

        if ($request->filled('type')) {
            $query->where('type', $request->input('type'));
        }

        if ($request->filled('parent_id')) {
            $query->where('parent_id', $request->input('parent_id'));
        }

        if ($request->boolean('roots_only')) {
            $query->whereNull('parent_id');
        }

        return $this->paginateResponse($query, $request);
    }

    public function tree()
    {
        $categories = Service::query()
            ->categories()
            ->orderBy('sort_order')
            ->with([
                'features',
                'processSteps',
                'faqs',
                'children' => fn ($q) => $q->orderBy('sort_order')->with(['features', 'processSteps', 'faqs']),
            ])
            ->get();

        return $this->successResponse($categories);
    }

    public function store(Request $request)
    {
        $validated = $request->validate($this->baseRules());
        $this->validateSlugUniqueness($validated);

        $service = DB::transaction(function () use ($validated, $request) {
            $service = Service::create($this->extractServiceAttributes($validated));
            $this->syncRelations($service, $request);

            return $service->load($this->relationships);
        });

        $this->logActivity('Service was created', $service, ['attributes' => $service->getAttributes()], 'created');

        return $this->createdResponse($service);
    }

    public function show($id)
    {
        $service = Service::with($this->relationships)->find($id);
        if (!$service) {
            return $this->notFoundResponse('Service not found');
        }

        return $this->successResponse($service);
    }

    public function update(Request $request, $id)
    {
        $service = Service::find($id);
        if (!$service) {
            return $this->notFoundResponse('Service not found');
        }

        $validated = $request->validate($this->baseRules(isUpdate: true, service: $service));
        $this->validateSlugUniqueness($validated, $service->id);

        $old = $service->getOriginal();

        DB::transaction(function () use ($service, $validated, $request) {
            $service->update($this->extractServiceAttributes($validated));
            $this->syncRelations($service, $request);
        });

        $service->load($this->relationships);

        $this->logActivity('Service was updated', $service, ['old' => $old, 'attributes' => $service->getAttributes()], 'updated');

        return $this->successResponse($service, 'Resource updated successfully');
    }

    public function destroy($id)
    {
        $service = Service::with('children')->find($id);
        if (!$service) {
            return $this->notFoundResponse('Service not found');
        }

        if ($service->isCategory() && $service->children->isNotEmpty()) {
            return $this->validationErrorResponse([
                'service' => ['Cannot delete a category that has child services. Delete or reassign children first.'],
            ]);
        }

        $service->delete();
        $this->logActivity('Service was deleted', $service, ['old' => $service->getOriginal()], 'deleted');

        return $this->noContentResponse('Resource deleted successfully');
    }

    public function reorder(Request $request)
    {
        $validated = $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|integer|exists:services,id',
            'items.*.sort_order' => 'required|integer|min:0',
            'items.*.parent_id' => 'nullable|integer|exists:services,id',
        ]);

        DB::transaction(function () use ($validated) {
            foreach ($validated['items'] as $item) {
                Service::where('id', $item['id'])->update([
                    'sort_order' => $item['sort_order'],
                    'parent_id' => $item['parent_id'] ?? null,
                ]);
            }
        });

        return $this->successResponse(null, 'Sort order updated successfully');
    }

    public function uploadIcon(Request $request, $id)
    {
        $service = Service::find($id);
        if (!$service) {
            return $this->notFoundResponse('Service not found');
        }

        $request->validate([
            'icon' => 'required|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
        ]);

        if ($service->icon && !str_starts_with($service->icon, 'http')) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $service->icon));
        }

        $path = $request->file('icon')->store('services/icons', 'public');
        $service->update(['icon' => '/storage/' . $path]);

        return $this->successResponse($service, 'Icon uploaded successfully');
    }

    public function uploadHeroImage(Request $request, $id)
    {
        $service = Service::find($id);
        if (!$service) {
            return $this->notFoundResponse('Service not found');
        }

        $request->validate([
            'hero_image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
        ]);

        if ($service->hero_image && !str_starts_with($service->hero_image, 'http')) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $service->hero_image));
        }

        $path = $request->file('hero_image')->store('services/hero', 'public');
        $service->update(['hero_image' => '/storage/' . $path]);

        return $this->successResponse($service, 'Hero image uploaded successfully');
    }

    public function referenceOptions()
    {
        return $this->successResponse([
            'portfolio_categories' => [],
            'pricing_category_slugs' => [],
        ]);
    }

    private function baseRules(bool $isUpdate = false, ?Service $service = null): array
    {
        $typeRule = Rule::in(array_column(ServiceType::cases(), 'value'));

        return [
            'parent_id' => ['nullable', 'integer', 'exists:services,id'],
            'type' => [$isUpdate ? 'sometimes' : 'required', $typeRule],
            'slug' => [$isUpdate ? 'sometimes' : 'required', 'string', 'max:100', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/'],
            'name' => [$isUpdate ? 'sometimes' : 'required', 'string', 'max:255'],
            'short_name' => ['nullable', 'string', 'max:100'],
            'icon' => ['nullable', 'string', 'max:500'],
            'hero_image' => ['nullable', 'string', 'max:500'],
            'banner_title' => ['nullable', 'string', 'max:255'],
            'banner_subtitle' => ['nullable', 'string'],
            'hero_title' => ['nullable', 'string', 'max:255'],
            'hero_title_highlight' => ['nullable', 'string', 'max:100'],
            'hero_description' => ['nullable', 'string'],
            'section_title' => ['nullable', 'string', 'max:255'],
            'section_subtitle' => ['nullable', 'string'],
            'cta_text' => ['nullable', 'string', 'max:100'],
            'cta_url' => ['nullable', 'string', 'max:500'],
            'portfolio_category' => ['nullable', 'string', 'max:100'],
            'pricing_category_slug' => ['nullable', 'string', 'max:100'],
            'show_in_nav' => ['sometimes', 'boolean'],
            'show_on_homepage' => ['sometimes', 'boolean'],
            'sort_order' => ['sometimes', 'integer', 'min:0'],
            'status' => ['sometimes', Rule::in(['draft', 'published'])],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string'],
            'features' => ['nullable', 'array'],
            'features.*.id' => ['nullable', 'integer'],
            'features.*.label' => ['required_with:features', 'string', 'max:255'],
            'features.*.sort_order' => ['nullable', 'integer', 'min:0'],
            'features.*.show_in_card' => ['nullable', 'boolean'],
            'process_steps' => ['nullable', 'array'],
            'process_steps.*.id' => ['nullable', 'integer'],
            'process_steps.*.step_number' => ['required_with:process_steps', 'integer', 'min:1'],
            'process_steps.*.title' => ['required_with:process_steps', 'string', 'max:255'],
            'process_steps.*.description' => ['nullable', 'string'],
            'process_steps.*.tasks' => ['nullable', 'array'],
            'process_steps.*.tasks.*' => ['string'],
            'process_steps.*.sort_order' => ['nullable', 'integer', 'min:0'],
            'faqs' => ['nullable', 'array'],
            'faqs.*.id' => ['nullable', 'integer'],
            'faqs.*.question' => ['required_with:faqs', 'string'],
            'faqs.*.answer' => ['required_with:faqs', 'string'],
            'faqs.*.sort_order' => ['nullable', 'integer', 'min:0'],
        ];
    }

    private function extractServiceAttributes(array $validated): array
    {
        return collect($validated)->except(['features', 'process_steps', 'faqs'])->all();
    }

    private function validateSlugUniqueness(array $validated, ?int $ignoreId = null): void
    {
        $type = $validated['type'] ?? null;
        $parentId = $validated['parent_id'] ?? null;
        $slug = $validated['slug'] ?? null;

        if (!$slug) {
            return;
        }

        $query = Service::query()->where('slug', $slug);

        if ($type === ServiceType::Category->value || ($type === null && $parentId === null)) {
            $query->whereNull('parent_id')->where('type', ServiceType::Category);
        } else {
            $query->where('parent_id', $parentId);
        }

        if ($ignoreId) {
            $query->where('id', '!=', $ignoreId);
        }

        if ($query->exists()) {
            abort(response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => ['slug' => ['The slug has already been taken for this parent.']],
                'status_code' => 422,
            ], 422));
        }
    }

    private function syncRelations(Service $service, Request $request): void
    {
        if ($request->has('features')) {
            $this->syncFeatures($service, $request->input('features', []));
        }

        if ($request->has('process_steps')) {
            $this->syncProcessSteps($service, $request->input('process_steps', []));
        }

        if ($request->has('faqs')) {
            $this->syncFaqs($service, $request->input('faqs', []));
        }
    }

    private function syncFeatures(Service $service, array $features): void
    {
        $keptIds = [];

        foreach ($features as $index => $feature) {
            $payload = [
                'label' => $feature['label'],
                'sort_order' => $feature['sort_order'] ?? $index,
                'show_in_card' => $feature['show_in_card'] ?? true,
            ];

            if (!empty($feature['id'])) {
                $model = ServiceFeature::where('service_id', $service->id)->where('id', $feature['id'])->first();
                if ($model) {
                    $model->update($payload);
                    $keptIds[] = $model->id;
                    continue;
                }
            }

            $model = $service->features()->create($payload);
            $keptIds[] = $model->id;
        }

        $service->features()->whereNotIn('id', $keptIds)->delete();
    }

    private function syncProcessSteps(Service $service, array $steps): void
    {
        $keptIds = [];

        foreach ($steps as $index => $step) {
            $payload = [
                'step_number' => $step['step_number'],
                'title' => $step['title'],
                'description' => $step['description'] ?? null,
                'tasks' => $step['tasks'] ?? [],
                'sort_order' => $step['sort_order'] ?? $index,
            ];

            if (!empty($step['id'])) {
                $model = ServiceProcessStep::where('service_id', $service->id)->where('id', $step['id'])->first();
                if ($model) {
                    $model->update($payload);
                    $keptIds[] = $model->id;
                    continue;
                }
            }

            $model = $service->processSteps()->create($payload);
            $keptIds[] = $model->id;
        }

        $service->processSteps()->whereNotIn('id', $keptIds)->delete();
    }

    private function syncFaqs(Service $service, array $faqs): void
    {
        $keptIds = [];

        foreach ($faqs as $index => $faq) {
            $payload = [
                'question' => $faq['question'],
                'answer' => $faq['answer'],
                'sort_order' => $faq['sort_order'] ?? $index,
            ];

            if (!empty($faq['id'])) {
                $model = ServiceFaq::where('service_id', $service->id)->where('id', $faq['id'])->first();
                if ($model) {
                    $model->update($payload);
                    $keptIds[] = $model->id;
                    continue;
                }
            }

            $model = $service->faqs()->create($payload);
            $keptIds[] = $model->id;
        }

        $service->faqs()->whereNotIn('id', $keptIds)->delete();
    }
}
