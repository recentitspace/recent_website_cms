<?php

namespace App\Http\Controllers\Api;

use App\Models\AboutObjective;

class AboutObjectiveController extends BaseController
{
    protected $model = AboutObjective::class;

    protected $searchableFields = ['title', 'body'];

    protected $sortableFields = [
        'id', 'title', 'sort_order', 'is_active', 'created_at', 'updated_at',
    ];

    protected $defaultSortField = 'sort_order';

    protected $defaultSortDirection = 'asc';

    protected $validationRules = [
        'store' => [
            'title' => 'required|string|max:255',
            'body' => 'nullable|string',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ],
        'update' => [
            'title' => 'sometimes|required|string|max:255',
            'body' => 'nullable|string',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ],
    ];
}
