<?php

namespace App\Http\Controllers\Api;

use App\Models\ServiceCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ServiceCategoryController extends BaseController
{
    protected $model = ServiceCategory::class;

    protected $searchableFields = ['title', 'slug', 'hero_title', 'listing_subtitle', 'page_path'];

    protected $sortableFields = [
        'id', 'title', 'slug', 'sort_order', 'is_active', 'show_on_home', 'created_at', 'updated_at',
    ];

    protected $defaultSortField = 'sort_order';

    protected $defaultSortDirection = 'asc';

    protected $relationships = ['icon', 'heroImage'];

    protected $validationRules = [
        'store' => [
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:service_categories,slug',
            'icon_id' => 'nullable|exists:media,id',
            'hero_image_id' => 'nullable|exists:media,id',
            'hero_title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'listing_subtitle' => 'nullable|string|max:500',
            'page_path' => 'required|string|max:500',
            'cta_text' => 'nullable|string|max:100',
            'process_title' => 'nullable|string|max:255',
            'process_subtitle' => 'nullable|string|max:500',
            'process_steps' => 'nullable|array',
            'process_steps.*.title' => 'required_with:process_steps|string|max:255',
            'process_steps.*.description' => 'nullable|string',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
            'show_on_home' => 'nullable|boolean',
        ],
        'update' => [
            'title' => 'sometimes|required|string|max:255',
            'slug' => 'sometimes|nullable|string|max:255',
            'icon_id' => 'nullable|exists:media,id',
            'hero_image_id' => 'nullable|exists:media,id',
            'hero_title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'listing_subtitle' => 'nullable|string|max:500',
            'page_path' => 'sometimes|required|string|max:500',
            'cta_text' => 'nullable|string|max:100',
            'process_title' => 'nullable|string|max:255',
            'process_subtitle' => 'nullable|string|max:500',
            'process_steps' => 'nullable|array',
            'process_steps.*.title' => 'required_with:process_steps|string|max:255',
            'process_steps.*.description' => 'nullable|string',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
            'show_on_home' => 'nullable|boolean',
        ],
    ];

    public function store(Request $request)
    {
        $validated = $request->validate($this->validationRules['store']);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        $category = $this->model::create($validated);

        $this->logActivity(
            class_basename($this->model) . ' was created',
            $category,
            ['attributes' => $category->getAttributes()],
            'created'
        );

        return $this->createdResponse($category->load($this->relationships));
    }

    public function update(Request $request, $id)
    {
        $category = $this->model::find($id);
        if (!$category) {
            return $this->notFoundResponse();
        }

        $rules = $this->validationRules['update'];
        if ($request->has('slug')) {
            $rules['slug'] = 'sometimes|nullable|string|max:255|unique:service_categories,slug,' . $id;
        }

        $validated = $request->validate($rules);

        if (array_key_exists('slug', $validated) && empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title'] ?? $category->title);
        }

        $old = $category->getOriginal();
        $category->update($validated);

        $this->logActivity(
            class_basename($this->model) . ' was updated',
            $category,
            ['old' => $old, 'attributes' => $category->getAttributes()],
            'updated'
        );

        return $this->successResponse($category->load($this->relationships), 'Resource updated successfully');
    }
}
