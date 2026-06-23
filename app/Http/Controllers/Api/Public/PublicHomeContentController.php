<?php

namespace App\Http\Controllers\Api\Public;

use App\Models\AboutDriveItem;
use App\Models\AboutObjective;
use App\Models\Client;
use App\Models\StatCounter;
use App\Models\Testimonial;
use App\Models\WhyChooseItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PublicHomeContentController extends PublicController
{
    public function statCounters(Request $request): JsonResponse
    {
        $query = StatCounter::query()
            ->with('icon')
            ->where('is_active', true)
            ->orderBy('sort_order');

        $showOnHome = $this->parseBooleanQuery($request->query('show_on_home'));
        if ($showOnHome !== null) {
            $query->where('show_on_home', $showOnHome);
        }

        return $this->successResponse($query->get(), 'Stat counters retrieved successfully');
    }

    public function clients(Request $request): JsonResponse
    {
        $query = Client::query()
            ->with('logo')
            ->where('is_active', true)
            ->orderBy('sort_order');

        $showOnHome = $this->parseBooleanQuery($request->query('show_on_home'));
        if ($showOnHome !== null) {
            $query->where('show_on_home', $showOnHome);
        }

        return $this->successResponse($query->get(), 'Clients retrieved successfully');
    }

    public function testimonials(Request $request): JsonResponse
    {
        $query = Testimonial::query()
            ->with(['logoLight', 'logoDark', 'avatar'])
            ->where('is_active', true)
            ->orderBy('sort_order');

        $showOnHome = $this->parseBooleanQuery($request->query('show_on_home'));
        if ($showOnHome !== null) {
            $query->where('show_on_home', $showOnHome);
        }

        return $this->successResponse($query->get(), 'Testimonials retrieved successfully');
    }

    public function whyChooseItems(): JsonResponse
    {
        $items = WhyChooseItem::query()
            ->with('icon')
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        return $this->successResponse($items, 'Why choose items retrieved successfully');
    }

    public function aboutDriveItems(): JsonResponse
    {
        $items = AboutDriveItem::query()
            ->with('image')
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        return $this->successResponse($items, 'About drive items retrieved successfully');
    }

    public function aboutObjectives(): JsonResponse
    {
        $items = AboutObjective::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        return $this->successResponse($items, 'About objectives retrieved successfully');
    }
}
