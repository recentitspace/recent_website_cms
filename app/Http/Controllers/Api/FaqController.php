<?php

namespace App\Http\Controllers\Api;

use App\Models\Faq;

class FaqController extends BaseController
{
    protected $model = Faq::class;

    protected $searchableFields = ['question'];

    protected $sortableFields = [
        'id', 'question', 'sort_order', 'is_active', 'created_at', 'updated_at',
    ];

    protected $defaultSortField = 'sort_order';

    protected $defaultSortDirection = 'asc';

    protected $relationships = ['serviceCategory'];

    protected $validationRules = [
        'store' => [
            'service_category_id' => 'nullable|exists:service_categories,id',
            'question' => 'required|string|max:500',
            'answer_paragraphs' => 'required|array|min:1',
            'answer_paragraphs.*' => 'required|string',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ],
        'update' => [
            'service_category_id' => 'nullable|exists:service_categories,id',
            'question' => 'sometimes|required|string|max:500',
            'answer_paragraphs' => 'sometimes|required|array|min:1',
            'answer_paragraphs.*' => 'required|string',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ],
    ];
}
