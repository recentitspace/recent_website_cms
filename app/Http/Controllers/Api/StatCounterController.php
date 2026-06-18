<?php

namespace App\Http\Controllers\Api;

use App\Models\StatCounter;

class StatCounterController extends BaseController
{
    protected $model = StatCounter::class;

    protected $searchableFields = ['label', 'value'];

    protected $sortableFields = [
        'id', 'label', 'value', 'sort_order', 'is_active', 'show_on_home', 'created_at', 'updated_at',
    ];

    protected $defaultSortField = 'sort_order';

    protected $defaultSortDirection = 'asc';

    protected $relationships = ['icon'];

    protected $validationRules = [
        'store' => [
            'label' => 'required|string|max:255',
            'value' => 'required|string|max:50',
            'suffix' => 'nullable|string|max:20',
            'icon_id' => 'nullable|exists:media,id',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
            'show_on_home' => 'nullable|boolean',
        ],
        'update' => [
            'label' => 'sometimes|required|string|max:255',
            'value' => 'sometimes|required|string|max:50',
            'suffix' => 'nullable|string|max:20',
            'icon_id' => 'nullable|exists:media,id',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
            'show_on_home' => 'nullable|boolean',
        ],
    ];
}
