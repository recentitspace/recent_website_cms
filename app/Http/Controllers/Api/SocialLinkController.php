<?php

namespace App\Http\Controllers\Api;

use App\Models\SocialLink;

class SocialLinkController extends BaseController
{
    protected $model = SocialLink::class;

    protected $searchableFields = ['platform', 'url'];

    protected $sortableFields = ['id', 'platform', 'url', 'sort_order', 'is_active', 'created_at', 'updated_at'];

    protected $validationRules = [
        'store' => [
            'platform' => 'required|string|max:50|in:facebook,instagram,tiktok,linkedin,twitter,youtube,other',
            'url' => 'required|url|max:500',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ],
        'update' => [
            'platform' => 'sometimes|required|string|max:50|in:facebook,instagram,tiktok,linkedin,twitter,youtube,other',
            'url' => 'sometimes|required|url|max:500',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ],
    ];
}
