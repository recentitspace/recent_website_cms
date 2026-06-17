<?php

namespace App\Http\Controllers\Api;

use App\Models\PortfolioItem;
use App\Models\PortfolioItemImage;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PortfolioItemController extends BaseController
{
    protected $model = PortfolioItem::class;

    protected $searchableFields = ['title', 'slug', 'tags'];

    protected $sortableFields = [
        'id', 'title', 'slug', 'type', 'featured', 'sort_order', 'is_published', 'created_at', 'updated_at',
    ];

    protected $relationships = ['category', 'thumbnail', 'galleryImages.media'];

    protected $validationRules = [
        'store' => [
            'portfolio_category_id' => 'required|exists:portfolio_categories,id',
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:portfolio_items,slug',
            'tags' => 'nullable|string|max:255',
            'type' => 'required|in:image,project,video',
            'thumbnail_id' => 'nullable|exists:media,id',
            'external_link' => 'nullable|url|max:500',
            'youtube_url' => 'nullable|url|max:500',
            'featured' => 'nullable|boolean',
            'sort_order' => 'nullable|integer|min:0',
            'is_published' => 'nullable|boolean',
            'show_on_home' => 'nullable|boolean',
            'home_sort_order' => 'nullable|integer|min:0',
            'gallery_media_ids' => 'nullable|array',
            'gallery_media_ids.*' => 'integer|exists:media,id',
        ],
        'update' => [
            'portfolio_category_id' => 'sometimes|required|exists:portfolio_categories,id',
            'title' => 'sometimes|required|string|max:255',
            'slug' => 'sometimes|nullable|string|max:255',
            'tags' => 'nullable|string|max:255',
            'type' => 'sometimes|required|in:image,project,video',
            'thumbnail_id' => 'nullable|exists:media,id',
            'external_link' => 'nullable|url|max:500',
            'youtube_url' => 'nullable|url|max:500',
            'featured' => 'nullable|boolean',
            'sort_order' => 'nullable|integer|min:0',
            'is_published' => 'nullable|boolean',
            'show_on_home' => 'nullable|boolean',
            'home_sort_order' => 'nullable|integer|min:0',
            'gallery_media_ids' => 'nullable|array',
            'gallery_media_ids.*' => 'integer|exists:media,id',
        ],
    ];

    public function index(Request $request)
    {
        $query = $this->model::query();

        if ($request->filled('portfolio_category_id')) {
            $query->where('portfolio_category_id', $request->integer('portfolio_category_id'));
        }

        if ($request->filled('type')) {
            $query->where('type', $request->input('type'));
        }

        if ($request->has('featured')) {
            $query->where('featured', filter_var($request->input('featured'), FILTER_VALIDATE_BOOLEAN));
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

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        $galleryMediaIds = $validated['gallery_media_ids'] ?? [];
        unset($validated['gallery_media_ids']);

        $item = $this->model::create($validated);
        $this->syncGallery($item, $galleryMediaIds, $request);
        $item->load($this->relationships);

        $this->logActivity(
            class_basename($this->model) . ' was created',
            $item,
            ['attributes' => $item->getAttributes()],
            'created'
        );

        return $this->createdResponse($item);
    }

    public function update(Request $request, $id)
    {
        $item = $this->model::find($id);
        if (!$item) {
            return $this->notFoundResponse();
        }

        $rules = $this->validationRules['update'];
        if ($request->has('slug')) {
            $rules['slug'] = 'sometimes|nullable|string|max:255|unique:portfolio_items,slug,' . $id;
        }

        $validated = $request->validate($rules);

        if (array_key_exists('slug', $validated) && empty($validated['slug']) && isset($validated['title'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        $galleryMediaIds = $validated['gallery_media_ids'] ?? null;
        unset($validated['gallery_media_ids']);

        $old = $item->getOriginal();
        $item->update($validated);
        if (is_array($galleryMediaIds)) {
            $this->syncGallery($item, $galleryMediaIds, $request);
        }
        $item->load($this->relationships);

        $this->logActivity(
            class_basename($this->model) . ' was updated',
            $item,
            ['old' => $old, 'attributes' => $item->getAttributes()],
            'updated'
        );

        return $this->successResponse($item, 'Resource updated successfully');
    }

    protected function syncGallery(PortfolioItem $item, array $mediaIds, Request $request): void
    {
        $externalLink = $request->input('external_link', $item->external_link);
        $type = $request->input('type', $item->type);

        // If external link exists, gallery is not allowed and is cleared.
        if (!empty($externalLink) || $type === 'video') {
            PortfolioItemImage::where('portfolio_item_id', $item->id)->delete();

            return;
        }

        // Internal items (no external link) require at least 1 gallery image
        if (count($mediaIds) === 0) {
            abort(422, 'Gallery images are required for internal portfolio items.');
        }

        PortfolioItemImage::where('portfolio_item_id', $item->id)->delete();

        foreach (array_values($mediaIds) as $index => $mediaId) {
            PortfolioItemImage::create([
                'portfolio_item_id' => $item->id,
                'media_id' => $mediaId,
                'sort_order' => $index + 1,
            ]);
        }
    }
}
