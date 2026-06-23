<?php

namespace App\Http\Controllers\Api\Public;

use App\Models\PageBlock;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PublicPageBlockController extends PublicController
{
    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'page' => 'nullable|string|in:home,about,faq,contact,pricing',
        ]);

        $query = PageBlock::query()
            ->with('image')
            ->where('is_active', true);

        if ($request->filled('page')) {
            $query->where('page', $request->input('page'));
        }

        $blocks = $query->orderBy('key')->get();

        return $this->successResponse($blocks, 'Page blocks retrieved successfully');
    }

    public function show(string $key): JsonResponse
    {
        $block = PageBlock::query()
            ->with('image')
            ->where('is_active', true)
            ->where('key', $key)
            ->first();

        if (!$block) {
            return $this->notFoundResponse('Page block not found');
        }

        return $this->successResponse($block, 'Page block retrieved successfully');
    }
}
