<?php

namespace App\Http\Controllers\Api;

use App\Models\PageBlock;
use Illuminate\Http\Request;

class PageBlockController extends BaseController
{
    protected $model = PageBlock::class;

    protected $searchableFields = ['page', 'key', 'title', 'subtitle'];

    protected $sortableFields = [
        'id', 'page', 'key', 'title', 'is_active', 'created_at', 'updated_at',
    ];

    protected $defaultSortField = 'key';

    protected $defaultSortDirection = 'asc';

    protected $relationships = ['image'];

    protected $validationRules = [
        'store' => [
            'page' => 'required|string|in:home,about,faq,contact,pricing',
            'key' => 'required|string|max:100|unique:page_blocks,key',
            'title' => 'nullable|string|max:500',
            'subtitle' => 'nullable|string|max:500',
            'body' => 'nullable|string',
            'image_id' => 'nullable|exists:media,id',
            'cta_text' => 'nullable|string|max:100',
            'cta_url' => 'nullable|string|max:500',
            'cta_secondary_text' => 'nullable|string|max:100',
            'cta_secondary_url' => 'nullable|string|max:500',
            'video_url' => 'nullable|string|max:500',
            'is_active' => 'nullable|boolean',
        ],
        'update' => [
            'page' => 'sometimes|required|string|in:home,about,faq,contact,pricing',
            'key' => 'sometimes|required|string|max:100',
            'title' => 'nullable|string|max:500',
            'subtitle' => 'nullable|string|max:500',
            'body' => 'nullable|string',
            'image_id' => 'nullable|exists:media,id',
            'cta_text' => 'nullable|string|max:100',
            'cta_url' => 'nullable|string|max:500',
            'cta_secondary_text' => 'nullable|string|max:100',
            'cta_secondary_url' => 'nullable|string|max:500',
            'video_url' => 'nullable|string|max:500',
            'is_active' => 'nullable|boolean',
        ],
    ];

    public function index(Request $request)
    {
        $query = $this->model::query();

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

    public function update(Request $request, $id)
    {
        $block = $this->model::find($id);
        if (!$block) {
            return $this->notFoundResponse();
        }

        $rules = $this->validationRules['update'];
        if ($request->has('key')) {
            $rules['key'] = 'sometimes|required|string|max:100|unique:page_blocks,key,' . $id;
        }

        $validated = $request->validate($rules);

        $old = $block->getOriginal();
        $block->update($validated);

        $this->logActivity(
            class_basename($this->model) . ' was updated',
            $block,
            ['old' => $old, 'attributes' => $block->getAttributes()],
            'updated'
        );

        return $this->successResponse($block->load($this->relationships), 'Resource updated successfully');
    }
}
