<?php

namespace App\Http\Controllers\Api;

use App\Models\DomainRequest;

class DomainRequestController extends BaseController
{
    protected $model = DomainRequest::class;

    protected $searchableFields = [
        'domain_name', 'extension', 'email', 'phone', 'address', 'status', 'extension_price',
    ];

    protected $sortableFields = [
        'id', 'domain_name', 'extension', 'email', 'phone', 'status',
        'extension_price', 'created_at', 'updated_at',
    ];

    protected $defaultSortField = 'created_at';

    protected $defaultSortDirection = 'desc';

    protected $validationRules = [
        'update' => [
            'status' => 'sometimes|required|string|in:pending,contacted,canceled,completed',
        ],
    ];
}
