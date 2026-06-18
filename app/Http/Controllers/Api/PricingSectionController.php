<?php

namespace App\Http\Controllers\Api;

use App\Models\PricingSection;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PricingSectionController extends BaseController
{
    protected $model = PricingSection::class;

    protected $searchableFields = ['title', 'slug', 'subtitle'];

    protected $sortableFields = [
        'id', 'title', 'slug', 'sort_order', 'is_active', 'show_on_home', 'created_at', 'updated_at',
    ];

    protected $defaultSortField = 'sort_order';

    protected $defaultSortDirection = 'asc';

    protected $validationRules = [
        'store' => [
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:pricing_sections,slug',
            'subtitle' => 'nullable|string|max:500',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
            'show_on_home' => 'nullable|boolean',
        ],
        'update' => [
            'title' => 'sometimes|required|string|max:255',
            'slug' => 'sometimes|nullable|string|max:255',
            'subtitle' => 'nullable|string|max:500',
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

        $section = $this->model::create($validated);

        $this->logActivity(
            class_basename($this->model) . ' was created',
            $section,
            ['attributes' => $section->getAttributes()],
            'created'
        );

        return $this->createdResponse($section);
    }

    public function update(Request $request, $id)
    {
        $section = $this->model::find($id);
        if (!$section) {
            return $this->notFoundResponse();
        }

        $rules = $this->validationRules['update'];
        if ($request->has('slug')) {
            $rules['slug'] = 'sometimes|nullable|string|max:255|unique:pricing_sections,slug,' . $id;
        }

        $validated = $request->validate($rules);

        if (array_key_exists('slug', $validated) && empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title'] ?? $section->title);
        }

        $old = $section->getOriginal();
        $section->update($validated);

        $this->logActivity(
            class_basename($this->model) . ' was updated',
            $section,
            ['old' => $old, 'attributes' => $section->getAttributes()],
            'updated'
        );

        return $this->successResponse($section, 'Resource updated successfully');
    }
}
