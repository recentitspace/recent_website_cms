<?php

namespace App\Http\Controllers\Api\Public;

use App\Models\Blog;
use App\Models\DomainExtension;
use App\Models\Faq;
use App\Models\ServiceCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PublicMiscController extends PublicController
{
    public function faqs(Request $request): JsonResponse
    {
        $request->validate([
            'service_category_slug' => 'nullable|string|max:255',
            'service_category_id' => 'nullable|integer|exists:service_categories,id',
            'general' => 'nullable|boolean',
        ]);

        $query = Faq::query()
            ->with('serviceCategory')
            ->where('is_active', true)
            ->orderBy('sort_order');

        if ($request->boolean('general')) {
            $query->whereNull('service_category_id');
        } elseif ($request->filled('service_category_id')) {
            $query->where('service_category_id', $request->integer('service_category_id'));
        } elseif ($request->filled('service_category_slug')) {
            $categoryId = ServiceCategory::query()
                ->where('is_active', true)
                ->where('slug', $request->input('service_category_slug'))
                ->value('id');

            if (!$categoryId) {
                return $this->successResponse([], 'FAQs retrieved successfully');
            }

            $query->where('service_category_id', $categoryId);
        }

        return $this->successResponse($query->get(), 'FAQs retrieved successfully');
    }

    public function domainExtensions(): JsonResponse
    {
        $extensions = DomainExtension::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        return $this->successResponse($extensions, 'Domain extensions retrieved successfully');
    }

    public function blogs(Request $request): JsonResponse
    {
        $query = Blog::query()
            ->with('featuredImage')
            ->where('is_active', true)
            ->where(function ($builder) {
                $builder
                    ->whereNull('published_at')
                    ->orWhere('published_at', '<=', now());
            })
            ->orderBy('sort_order');

        $showOnHome = $this->parseBooleanQuery($request->query('show_on_home'));
        if ($showOnHome !== null) {
            $query->where('show_on_home', $showOnHome);
            if ($showOnHome) {
                $query->orderBy('home_sort_order');
            }
        }

        return $this->successResponse($query->get(), 'Blogs retrieved successfully');
    }

    public function showBlog(string $slug): JsonResponse
    {
        $blog = Blog::query()
            ->with('featuredImage')
            ->where('is_active', true)
            ->where('slug', $slug)
            ->where(function ($builder) {
                $builder
                    ->whereNull('published_at')
                    ->orWhere('published_at', '<=', now());
            })
            ->first();

        if (!$blog) {
            return $this->notFoundResponse('Blog post not found');
        }

        return $this->successResponse($blog, 'Blog post retrieved successfully');
    }
}
