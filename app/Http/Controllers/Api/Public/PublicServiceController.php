<?php

namespace App\Http\Controllers\Api\Public;

use App\Models\ServiceCategory;
use App\Models\ServiceItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PublicServiceController extends PublicController
{
    public function categories(Request $request): JsonResponse
    {
        $query = ServiceCategory::query()
            ->with('icon')
            ->where('is_active', true)
            ->orderBy('sort_order');

        $showOnHome = $this->parseBooleanQuery($request->query('show_on_home'));
        if ($showOnHome !== null) {
            $query->where('show_on_home', $showOnHome);
        }

        return $this->successResponse($query->get(), 'Service categories retrieved successfully');
    }

    public function showCategory(string $slug): JsonResponse
    {
        $category = ServiceCategory::query()
            ->with(['icon', 'heroImage'])
            ->where('is_active', true)
            ->where('slug', $slug)
            ->first();

        if (!$category) {
            return $this->notFoundResponse('Service category not found');
        }

        $items = ServiceItem::query()
            ->with('icon')
            ->where('service_category_id', $category->id)
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        $category->setRelation('items', $items);

        return $this->successResponse($category, 'Service category retrieved successfully');
    }

    public function showItem(string $slug): JsonResponse
    {
        $item = ServiceItem::query()
            ->with(['category', 'icon', 'heroImage'])
            ->where('is_active', true)
            ->where('slug', $slug)
            ->first();

        if (!$item || !$item->category?->is_active) {
            return $this->notFoundResponse('Service item not found');
        }

        return $this->successResponse($item, 'Service item retrieved successfully');
    }
}
