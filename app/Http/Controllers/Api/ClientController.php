<?php

namespace App\Http\Controllers\Api;

use App\Models\Client;

class ClientController extends BaseController
{
    protected $model = Client::class;

    protected $searchableFields = ['name', 'url'];

    protected $sortableFields = [
        'id', 'name', 'sort_order', 'is_active', 'show_on_home', 'created_at', 'updated_at',
    ];

    protected $defaultSortField = 'sort_order';

    protected $defaultSortDirection = 'asc';

    protected $relationships = ['logo'];

    protected $validationRules = [
        'store' => [
            'name' => 'required|string|max:255',
            'logo_id' => 'nullable|exists:media,id',
            'url' => 'nullable|url|max:500',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
            'show_on_home' => 'nullable|boolean',
        ],
        'update' => [
            'name' => 'sometimes|required|string|max:255',
            'logo_id' => 'nullable|exists:media,id',
            'url' => 'nullable|url|max:500',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
            'show_on_home' => 'nullable|boolean',
        ],
    ];
}
