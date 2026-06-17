<?php

namespace App\Http\Controllers\Api;

use App\Models\PortfolioCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PortfolioCategoryController extends BaseController
{
    protected $model = PortfolioCategory::class;

    protected $searchableFields = ['name', 'slug'];

    protected $sortableFields = ['id', 'name', 'slug', 'sort_order', 'is_active', 'created_at', 'updated_at'];

    protected $validationRules = [
        'store' => [
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:portfolio_categories,slug',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ],
        'update' => [
            'name' => 'sometimes|required|string|max:255',
            'slug' => 'sometimes|nullable|string|max:255',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ],
    ];

    public function store(Request $request)
    {
        $validated = $request->validate($this->validationRules['store']);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $category = $this->model::create($validated);

        $this->logActivity(
            class_basename($this->model) . ' was created',
            $category,
            ['attributes' => $category->getAttributes()],
            'created'
        );

        return $this->createdResponse($category);
    }

    public function update(Request $request, $id)
    {
        $category = $this->model::find($id);
        if (!$category) {
            return $this->notFoundResponse();
        }

        $rules = $this->validationRules['update'];
        if ($request->has('slug')) {
            $rules['slug'] = 'sometimes|nullable|string|max:255|unique:portfolio_categories,slug,' . $id;
        }

        $validated = $request->validate($rules);

        if (array_key_exists('slug', $validated) && empty($validated['slug']) && isset($validated['name'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $old = $category->getOriginal();
        $category->update($validated);

        $this->logActivity(
            class_basename($this->model) . ' was updated',
            $category,
            ['old' => $old, 'attributes' => $category->getAttributes()],
            'updated'
        );

        return $this->successResponse($category, 'Resource updated successfully');
    }
}
