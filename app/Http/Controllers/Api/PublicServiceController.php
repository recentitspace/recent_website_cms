<?php

namespace App\Http\Controllers\Api;

use App\Enums\ServiceStatus;
use App\Enums\ServiceType;
use App\Models\Service;
use App\Support\ServiceTransformer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class PublicServiceController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $includes = ServiceTransformer::parseIncludes($request->query('include'));
        $type = $request->query('type');

        if ($type === 'service') {
            $services = $this->serviceListQuery($request)->get();
            $this->loadIncludes($services, $includes);

            return response()->json([
                'data' => $services->map(
                    fn (Service $service) => ServiceTransformer::toPublicArray($service, $includes)
                )->values(),
            ]);
        }

        $categories = $this->categoryQuery($request)
            ->with($this->childrenEagerLoad($request, $includes))
            ->get();

        $this->loadIncludesOnTree($categories, $includes);

        return response()->json([
            'data' => $categories->map(
                fn (Service $category) => ServiceTransformer::toPublicArray($category, $includes)
            )->values(),
        ]);
    }

    public function navigation(Request $request): JsonResponse
    {
        $categories = Service::query()
            ->published()
            ->categories()
            ->where('show_in_nav', true)
            ->orderBy('sort_order')
            ->with(['children' => function ($query) {
                $query->published()
                    ->where('show_in_nav', true)
                    ->orderBy('sort_order');
            }])
            ->get();

        return response()->json([
            'data' => $categories->map(
                fn (Service $category) => ServiceTransformer::toNavigationItem($category)
            )->values(),
        ]);
    }

    public function category(string $slug): JsonResponse
    {
        $includes = ServiceTransformer::parseIncludes(request()->query('include'));

        $category = Service::query()
            ->published()
            ->categories()
            ->where('slug', $slug)
            ->with($this->childrenEagerLoad(request(), $includes))
            ->first();

        if (!$category) {
            return $this->notFound('Category not found.');
        }

        $this->loadIncludesOnTree(collect([$category]), $includes);

        return response()->json([
            'data' => ServiceTransformer::toPublicArray($category, $includes),
        ]);
    }

    public function show(string $categorySlug, string $serviceSlug): JsonResponse
    {
        $includes = ServiceTransformer::parseIncludes(request()->query('include', 'features,process_steps'));

        $category = Service::query()
            ->published()
            ->categories()
            ->where('slug', $categorySlug)
            ->first();

        if (!$category) {
            return $this->notFound('Category not found.');
        }

        $service = Service::query()
            ->published()
            ->where('type', ServiceType::Service)
            ->where('parent_id', $category->id)
            ->where('slug', $serviceSlug)
            ->with('parent')
            ->first();

        if (!$service) {
            return $this->notFound('Service not found.');
        }

        $this->loadIncludes(collect([$service]), $includes);

        return response()->json([
            'data' => ServiceTransformer::toPublicArray($service, $includes),
        ]);
    }

    private function categoryQuery(Request $request)
    {
        $query = Service::query()
            ->published()
            ->categories()
            ->orderBy('sort_order');

        if ($request->boolean('show_in_nav')) {
            $query->where('show_in_nav', true);
        }

        if ($request->boolean('show_on_homepage')) {
            $query->where('show_on_homepage', true);
        }

        return $query;
    }

    private function serviceListQuery(Request $request)
    {
        $query = Service::query()
            ->published()
            ->where('type', ServiceType::Service)
            ->with('parent')
            ->orderBy('sort_order');

        if ($request->boolean('show_in_nav')) {
            $query->where('show_in_nav', true);
        }

        if ($request->boolean('show_on_homepage')) {
            $query->where('show_on_homepage', true);
        }

        return $query;
    }

    private function childrenEagerLoad(Request $request, array $includes): array
    {
        return [
            'children' => function ($query) use ($request, $includes) {
                $query->published()
                    ->where('type', ServiceType::Service)
                    ->orderBy('sort_order');

                if ($request->boolean('show_in_nav')) {
                    $query->where('show_in_nav', true);
                }

                if ($request->boolean('show_on_homepage')) {
                    $query->where('show_on_homepage', true);
                }

                if (in_array('features', $includes, true)) {
                    $query->with('features');
                }
            },
        ];
    }

    private function loadIncludesOnTree($categories, array $includes): void
    {
        foreach ($categories as $category) {
            if (in_array('process_steps', $includes, true)) {
                $category->load('processSteps');
            }
            if (in_array('faqs', $includes, true)) {
                $category->load('faqs');
            }
            if (in_array('features', $includes, true) && $category->relationLoaded('children')) {
                $category->children->load('features');
            }
        }
    }

    private function loadIncludes($services, array $includes): void
    {
        $relations = [];
        if (in_array('features', $includes, true)) {
            $relations[] = 'features';
        }
        if (in_array('process_steps', $includes, true)) {
            $relations[] = 'processSteps';
        }
        if (in_array('faqs', $includes, true)) {
            $relations[] = 'faqs';
        }

        if ($relations) {
            $services->each->load($relations);
        }
    }

    private function notFound(string $message): JsonResponse
    {
        return response()->json([
            'message' => $message,
            'error' => 'not_found',
        ], 404);
    }
}
