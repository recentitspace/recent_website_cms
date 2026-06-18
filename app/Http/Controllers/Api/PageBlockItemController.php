<?php

namespace App\Http\Controllers\Api;

use App\Models\PageBlockItem;
use Illuminate\Http\Request;

class PageBlockItemController extends BaseController
{
    protected $model = PageBlockItem::class;

    protected $searchableFields = ['title', 'body'];

    protected $sortableFields = [
        'id', 'title', 'sort_order', 'is_active', 'created_at', 'updated_at',
    ];

    protected $defaultSortField = 'sort_order';

    protected $defaultSortDirection = 'asc';

    protected $relationships = ['block', 'image', 'icon'];

    protected $validationRules = [
        'store' => [
            'page_block_id' => 'required|exists:page_blocks,id',
            'title' => 'required|string|max:255',
            'body' => 'nullable|string',
            'image_id' => 'nullable|exists:media,id',
            'icon_id' => 'nullable|exists:media,id',
            'bullets' => 'nullable|array',
            'bullets.*' => 'string|max:500',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ],
        'update' => [
            'page_block_id' => 'sometimes|required|exists:page_blocks,id',
            'title' => 'sometimes|required|string|max:255',
            'body' => 'nullable|string',
            'image_id' => 'nullable|exists:media,id',
            'icon_id' => 'nullable|exists:media,id',
            'bullets' => 'nullable|array',
            'bullets.*' => 'string|max:500',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ],
    ];

    public function index(Request $request)
    {
        $query = $this->model::query();

        if ($request->filled('page_block_id')) {
            $query->where('page_block_id', $request->integer('page_block_id'));
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
}
