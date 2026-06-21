<?php

namespace App\Http\Controllers\Api;

use App\Models\DomainExtension;

class DomainExtensionController extends BaseController
{
    protected $model = DomainExtension::class;

    protected $searchableFields = ['extension', 'price', 'badge'];

    protected $sortableFields = [
        'id', 'extension', 'price', 'period', 'badge', 'sort_order', 'is_active', 'created_at', 'updated_at',
    ];

    protected $defaultSortField = 'sort_order';

    protected $defaultSortDirection = 'asc';

    protected $validationRules = [
        'store' => [
            'extension' => 'required|string|max:50',
            'price' => 'required|string|max:50',
            'period' => 'nullable|string|max:20',
            'badge' => 'nullable|string|max:100',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ],
        'update' => [
            'extension' => 'sometimes|required|string|max:50',
            'price' => 'sometimes|required|string|max:50',
            'period' => 'nullable|string|max:20',
            'badge' => 'nullable|string|max:100',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ],
    ];
}
