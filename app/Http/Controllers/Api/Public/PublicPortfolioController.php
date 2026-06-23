<?php

namespace App\Http\Controllers\Api\Public;

use App\Models\PortfolioCategory;
use App\Models\PortfolioItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PublicPortfolioController extends PublicController
{
    public function categories(): JsonResponse
    {
        $categories = PortfolioCategory::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        return $this->successResponse($categories, 'Portfolio categories retrieved successfully');
    }

    public function showCategory(string $slug): JsonResponse
    {
        $category = PortfolioCategory::query()
            ->where('is_active', true)
            ->where('slug', $slug)
            ->first();

        if (!$category) {
            return $this->notFoundResponse('Portfolio category not found');
        }

        $items = PortfolioItem::query()
            ->with(['thumbnail', 'galleryImages.media'])
            ->where('portfolio_category_id', $category->id)
            ->where('is_published', true)
            ->orderBy('sort_order')
            ->get();

        $category->setRelation('items', $items);

        return $this->successResponse($category, 'Portfolio category retrieved successfully');
    }

    public function items(Request $request): JsonResponse
    {
        $request->validate([
            'category_slug' => 'nullable|string|max:255',
            'portfolio_category_id' => 'nullable|integer|exists:portfolio_categories,id',
            'featured' => 'nullable|boolean',
        ]);

        $query = PortfolioItem::query()
            ->with(['category', 'thumbnail', 'galleryImages.media'])
            ->where('is_published', true)
            ->orderBy('sort_order');

        if ($request->filled('portfolio_category_id')) {
            $query->where('portfolio_category_id', $request->integer('portfolio_category_id'));
        }

        if ($request->filled('category_slug')) {
            $query->whereHas('category', function ($builder) use ($request) {
                $builder
                    ->where('slug', $request->input('category_slug'))
                    ->where('is_active', true);
            });
        }

        $featured = $this->parseBooleanQuery($request->query('featured'));
        if ($featured !== null) {
            $query->where('featured', $featured);
        }

        $showOnHome = $this->parseBooleanQuery($request->query('show_on_home'));
        if ($showOnHome !== null) {
            $query->where('show_on_home', $showOnHome);
            if ($showOnHome) {
                $query->orderBy('home_sort_order');
            }
        }

        return $this->successResponse($query->get(), 'Portfolio items retrieved successfully');
    }

    public function showItem(string $slug): JsonResponse
    {
        $item = PortfolioItem::query()
            ->with(['category', 'thumbnail', 'galleryImages.media'])
            ->where('is_published', true)
            ->where('slug', $slug)
            ->first();

        if (!$item) {
            return $this->notFoundResponse('Portfolio item not found');
        }

        return $this->successResponse($item, 'Portfolio item retrieved successfully');
    }
}
