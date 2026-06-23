<?php

namespace App\Http\Controllers\Api;

use App\Models\ServiceItem;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ServiceItemController extends BaseController
{
    protected $model = ServiceItem::class;

    protected $searchableFields = ['title', 'slug', 'page_path'];

    protected $sortableFields = [
        'id', 'title', 'slug', 'sort_order', 'is_active', 'show_on_home', 'created_at', 'updated_at',
    ];

    protected $defaultSortField = 'sort_order';

    protected $defaultSortDirection = 'asc';

    protected $relationships = ['category', 'icon', 'heroImage'];

    protected $validationRules = [
        'store' => [
            'service_category_id' => 'required|exists:service_categories,id',
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255',
            'icon_id' => 'nullable|exists:media,id',
            'page_path' => 'required|string|max:500',
            'detail_hero_title' => 'nullable|string|max:255',
            'detail_hero_description' => 'nullable|string',
            'hero_image_id' => 'nullable|exists:media,id',
            'highlights' => 'nullable|array',
            'highlights.*' => 'string|max:500',
            'process_title' => 'nullable|string|max:255',
            'process_subtitle' => 'nullable|string|max:500',
            'process_steps' => 'nullable|array',
            'process_steps.*.title' => 'required_with:process_steps|string|max:255',
            'process_steps.*.description' => 'nullable|string',
            'process_steps.*.tasks' => 'nullable|array',
            'process_steps.*.tasks.*' => 'string|max:500',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
            'show_on_home' => 'nullable|boolean',
            'show_featured_portfolio' => 'nullable|boolean',
            'portfolio_category_slug' => 'nullable|string|max:255|exists:portfolio_categories,slug|required_if:show_featured_portfolio,true',
            'show_domain_registration' => 'nullable|boolean',
        ],
        'update' => [
            'service_category_id' => 'sometimes|required|exists:service_categories,id',
            'title' => 'sometimes|required|string|max:255',
            'slug' => 'sometimes|nullable|string|max:255',
            'icon_id' => 'nullable|exists:media,id',
            'page_path' => 'sometimes|required|string|max:500',
            'detail_hero_title' => 'nullable|string|max:255',
            'detail_hero_description' => 'nullable|string',
            'hero_image_id' => 'nullable|exists:media,id',
            'highlights' => 'nullable|array',
            'highlights.*' => 'string|max:500',
            'process_title' => 'nullable|string|max:255',
            'process_subtitle' => 'nullable|string|max:500',
            'process_steps' => 'nullable|array',
            'process_steps.*.title' => 'required_with:process_steps|string|max:255',
            'process_steps.*.description' => 'nullable|string',
            'process_steps.*.tasks' => 'nullable|array',
            'process_steps.*.tasks.*' => 'string|max:500',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
            'show_on_home' => 'nullable|boolean',
            'show_featured_portfolio' => 'nullable|boolean',
            'portfolio_category_slug' => 'nullable|string|max:255|exists:portfolio_categories,slug|required_if:show_featured_portfolio,true',
            'show_domain_registration' => 'nullable|boolean',
        ],
    ];

    public function index(Request $request)
    {
        $query = $this->model::query();

        if ($request->filled('service_category_id')) {
            $query->where('service_category_id', $request->integer('service_category_id'));
        }

        $query = $this->applyApiFilters(
            $query,
            $request,
            $this->searchableFields,
            $this->sortableFields,
            $this->defaultSortField,
            $this->defaultSortDirection
        );

        if (!empty($this->relationships)) {
            $query->with($this->relationships);
        }

        return $this->paginateResponse($query, $request);
    }

    public function store(Request $request)
    {
        $validated = $request->validate($this->validationRules['store']);
        $validated = $this->normalizePageSectionFields($validated);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        $item = $this->model::create($validated);

        $this->logActivity(
            class_basename($this->model) . ' was created',
            $item,
            ['attributes' => $item->getAttributes()],
            'created'
        );

        return $this->createdResponse($item->load($this->relationships));
    }

    public function update(Request $request, $id)
    {
        $item = $this->model::find($id);
        if (!$item) {
            return $this->notFoundResponse();
        }

        $rules = $this->validationRules['update'];
        if ($request->has('slug')) {
            $rules['slug'] = 'sometimes|nullable|string|max:255';
        }

        $validated = $request->validate($rules);
        $validated = $this->normalizePageSectionFields($validated, $item);

        if (array_key_exists('slug', $validated) && empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title'] ?? $item->title);
        }

        $old = $item->getOriginal();
        $item->update($validated);

        $this->logActivity(
            class_basename($this->model) . ' was updated',
            $item,
            ['old' => $old, 'attributes' => $item->getAttributes()],
            'updated'
        );

        return $this->successResponse($item->load($this->relationships), 'Resource updated successfully');
    }

    protected function normalizePageSectionFields(array $validated, ?ServiceItem $item = null): array
    {
        $showFeaturedPortfolio = array_key_exists('show_featured_portfolio', $validated)
            ? (bool) $validated['show_featured_portfolio']
            : (bool) ($item?->show_featured_portfolio ?? false);

        if (!$showFeaturedPortfolio) {
            $validated['portfolio_category_slug'] = null;
        }

        return $validated;
    }
}
