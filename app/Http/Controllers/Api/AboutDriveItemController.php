<?php

namespace App\Http\Controllers\Api;

use App\Models\AboutDriveItem;

class AboutDriveItemController extends BaseController
{
    protected $model = AboutDriveItem::class;

    protected $searchableFields = ['title', 'body'];

    protected $sortableFields = [
        'id', 'title', 'sort_order', 'is_active', 'created_at', 'updated_at',
    ];

    protected $defaultSortField = 'sort_order';

    protected $defaultSortDirection = 'asc';

    protected $relationships = ['image'];

    protected $validationRules = [
        'store' => [
            'title' => 'required|string|max:255',
            'body' => 'nullable|string',
            'image_id' => 'nullable|exists:media,id',
            'bullets' => 'nullable|array',
            'bullets.*' => 'string',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ],
        'update' => [
            'title' => 'sometimes|required|string|max:255',
            'body' => 'nullable|string',
            'image_id' => 'nullable|exists:media,id',
            'bullets' => 'nullable|array',
            'bullets.*' => 'string',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ],
    ];
}
