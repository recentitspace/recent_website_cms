<?php

namespace App\Http\Controllers\Api;

use App\Models\PricingPlan;
use Illuminate\Http\Request;

class PricingPlanController extends BaseController
{
    protected $model = PricingPlan::class;

    protected $searchableFields = ['name', 'price'];

    protected $sortableFields = [
        'id', 'name', 'price', 'sort_order', 'is_active', 'created_at', 'updated_at',
    ];

    protected $defaultSortField = 'sort_order';

    protected $defaultSortDirection = 'asc';

    protected $relationships = ['section'];

    protected $validationRules = [
        'store' => [
            'pricing_section_id' => 'required|exists:pricing_sections,id',
            'name' => 'required|string|max:255',
            'price' => 'required|string|max:50',
            'price_period' => 'nullable|string|max:100',
            'style' => 'nullable|string|in:standard,featured,premium',
            'cta_text' => 'nullable|string|max:100',
            'cta_url' => 'nullable|string|max:500',
            'features' => 'nullable|array',
            'features.*.text' => 'required_with:features|string|max:500',
            'features.*.included' => 'nullable|boolean',
            'features.*.hidden' => 'nullable|boolean',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ],
        'update' => [
            'pricing_section_id' => 'sometimes|required|exists:pricing_sections,id',
            'name' => 'sometimes|required|string|max:255',
            'price' => 'sometimes|required|string|max:50',
            'price_period' => 'nullable|string|max:100',
            'style' => 'nullable|string|in:standard,featured,premium',
            'cta_text' => 'nullable|string|max:100',
            'cta_url' => 'nullable|string|max:500',
            'features' => 'nullable|array',
            'features.*.text' => 'required_with:features|string|max:500',
            'features.*.included' => 'nullable|boolean',
            'features.*.hidden' => 'nullable|boolean',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ],
    ];

    public function index(Request $request)
    {
        $query = $this->model::query();

        if ($request->filled('pricing_section_id')) {
            $query->where('pricing_section_id', $request->integer('pricing_section_id'));
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
