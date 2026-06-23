<?php

namespace App\Http\Controllers\Api;

use App\Models\Blog;
use App\Services\CommonServices;
use Illuminate\Http\Request;

class BlogController extends BaseController
{
    protected $model = Blog::class;

    protected $searchableFields = ['title', 'slug', 'excerpt', 'author_name'];

    protected $sortableFields = [
        'id',
        'title',
        'slug',
        'sort_order',
        'home_sort_order',
        'published_at',
        'is_active',
        'show_on_home',
        'created_at',
        'updated_at',
    ];

    protected $defaultSortField = 'sort_order';

    protected $defaultSortDirection = 'asc';

    protected $relationships = ['featuredImage'];

    protected $validationRules = [
        'store' => [
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:blogs,slug',
            'excerpt' => 'nullable|string',
            'body_paragraphs' => 'nullable|array',
            'body_paragraphs.*' => 'nullable|string',
            'author_name' => 'nullable|string|max:255',
            'featured_image_id' => 'nullable|exists:media,id',
            'published_at' => 'nullable|date',
            'external_link' => 'nullable|url|max:500',
            'tags' => 'nullable|array',
            'tags.*' => 'nullable|string|max:100',
            'sort_order' => 'nullable|integer|min:0',
            'home_sort_order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
            'show_on_home' => 'nullable|boolean',
        ],
        'update' => [
            'title' => 'sometimes|required|string|max:255',
            'slug' => 'sometimes|nullable|string|max:255',
            'excerpt' => 'nullable|string',
            'body_paragraphs' => 'nullable|array',
            'body_paragraphs.*' => 'nullable|string',
            'author_name' => 'nullable|string|max:255',
            'featured_image_id' => 'nullable|exists:media,id',
            'published_at' => 'nullable|date',
            'external_link' => 'nullable|url|max:500',
            'tags' => 'nullable|array',
            'tags.*' => 'nullable|string|max:100',
            'sort_order' => 'nullable|integer|min:0',
            'home_sort_order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
            'show_on_home' => 'nullable|boolean',
        ],
    ];

    public function store(Request $request)
    {
        $validated = $request->validate($this->validationRules['store']);
        $validated = $this->prepareValidatedData($validated);

        $blog = $this->model::create($validated);
        $blog->load($this->relationships);

        $this->logActivity(
            class_basename($this->model) . ' was created',
            $blog,
            ['attributes' => $blog->getAttributes()],
            'created'
        );

        return $this->createdResponse($blog);
    }

    public function update(Request $request, $id)
    {
        $blog = $this->model::find($id);
        if (!$blog) {
            return $this->notFoundResponse();
        }

        $rules = $this->validationRules['update'];
        if ($request->has('slug')) {
            $rules['slug'] = 'sometimes|nullable|string|max:255|unique:blogs,slug,' . $id;
        }

        $validated = $request->validate($rules);
        $validated = $this->prepareValidatedData($validated, $blog);

        $old = $blog->getOriginal();
        $blog->update($validated);
        $blog->load($this->relationships);

        $this->logActivity(
            class_basename($this->model) . ' was updated',
            $blog,
            ['old' => $old, 'attributes' => $blog->getAttributes()],
            'updated'
        );

        return $this->successResponse($blog);
    }

    private function prepareValidatedData(array $validated, ?Blog $blog = null): array
    {
        $title = $validated['title'] ?? $blog?->title ?? '';

        if (empty($validated['slug']) && $title) {
            $validated['slug'] = CommonServices::generateSlug(
                $title,
                Blog::class,
                'slug',
                $blog?->id
            );
        }

        if (isset($validated['body_paragraphs'])) {
            $validated['body_paragraphs'] = array_values(
                array_filter(
                    array_map('trim', $validated['body_paragraphs']),
                    fn ($paragraph) => $paragraph !== ''
                )
            );
        }

        if (isset($validated['tags'])) {
            $validated['tags'] = array_values(
                array_filter(
                    array_map('trim', $validated['tags']),
                    fn ($tag) => $tag !== ''
                )
            );
        }

        $showOnHome = $validated['show_on_home'] ?? $blog?->show_on_home ?? false;
        if (!$showOnHome) {
            $validated['home_sort_order'] = null;
        }

        return $validated;
    }
}
