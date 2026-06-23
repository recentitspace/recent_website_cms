<?php

namespace App\Http\Controllers\Api\Public;

use App\Models\PricingPlan;
use App\Models\PricingSection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PublicPricingController extends PublicController
{
    public function sections(Request $request): JsonResponse
    {
        $query = PricingSection::query()
            ->where('is_active', true)
            ->orderBy('sort_order');

        $showOnHome = $this->parseBooleanQuery($request->query('show_on_home'));
        if ($showOnHome !== null) {
            $query->where('show_on_home', $showOnHome);
        }

        $sections = $query->get();

        if ($request->boolean('include_plans', true)) {
            $sections->load([
                'plans' => fn ($planQuery) => $planQuery
                    ->where('is_active', true)
                    ->orderBy('sort_order'),
            ]);
        }

        return $this->successResponse($sections, 'Pricing sections retrieved successfully');
    }

    public function showSection(string $slug): JsonResponse
    {
        $section = PricingSection::query()
            ->where('is_active', true)
            ->where('slug', $slug)
            ->first();

        if (!$section) {
            return $this->notFoundResponse('Pricing section not found');
        }

        $plans = PricingPlan::query()
            ->where('pricing_section_id', $section->id)
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        $section->setRelation('plans', $plans);

        return $this->successResponse($section, 'Pricing section retrieved successfully');
    }
}
