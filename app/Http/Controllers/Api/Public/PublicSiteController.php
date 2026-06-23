<?php

namespace App\Http\Controllers\Api\Public;

use App\Models\SiteSetting;
use App\Models\SocialLink;
use Illuminate\Http\JsonResponse;

class PublicSiteController extends PublicController
{
    public function settings(): JsonResponse
    {
        $settings = SiteSetting::with(['logoLight', 'logoDark', 'favicon'])->first();

        return $this->successResponse($settings, 'Site settings retrieved successfully');
    }

    public function socialLinks(): JsonResponse
    {
        $links = SocialLink::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        return $this->successResponse($links, 'Social links retrieved successfully');
    }
}
