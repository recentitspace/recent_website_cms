<?php

namespace App\Http\Controllers\Api;

use App\Models\Testimonial;

class TestimonialController extends BaseController
{
    protected $model = Testimonial::class;

    protected $searchableFields = ['quote', 'author_name', 'author_role'];

    protected $sortableFields = [
        'id', 'author_name', 'sort_order', 'is_active', 'show_on_home', 'created_at', 'updated_at',
    ];

    protected $defaultSortField = 'sort_order';

    protected $defaultSortDirection = 'asc';

    protected $relationships = ['logoLight', 'logoDark', 'avatar'];

    protected $validationRules = [
        'store' => [
            'quote' => 'required|string',
            'author_name' => 'required|string|max:255',
            'author_role' => 'nullable|string|max:255',
            'logo_light_id' => 'nullable|exists:media,id',
            'logo_dark_id' => 'nullable|exists:media,id',
            'avatar_id' => 'nullable|exists:media,id',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
            'show_on_home' => 'nullable|boolean',
        ],
        'update' => [
            'quote' => 'sometimes|required|string',
            'author_name' => 'sometimes|required|string|max:255',
            'author_role' => 'nullable|string|max:255',
            'logo_light_id' => 'nullable|exists:media,id',
            'logo_dark_id' => 'nullable|exists:media,id',
            'avatar_id' => 'nullable|exists:media,id',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
            'show_on_home' => 'nullable|boolean',
        ],
    ];
}
