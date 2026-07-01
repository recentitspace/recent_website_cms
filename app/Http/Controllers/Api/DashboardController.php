<?php

namespace App\Http\Controllers\Api;

use App\Enums\DomainRequestStatus;
use App\Models\Blog;
use App\Models\Client;
use App\Models\DomainRequest;
use App\Models\Media;
use App\Models\PortfolioItem;
use App\Models\Testimonial;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;
use Spatie\Activitylog\Models\Activity;

class DashboardController extends Controller
{
    use ApiResponseTrait;

    public function index(): JsonResponse
    {
        $domainRequestsByStatus = [
            'pending' => DomainRequest::query()->where('status', DomainRequestStatus::PENDING)->count(),
            'contacted' => DomainRequest::query()->where('status', DomainRequestStatus::CONTACTED)->count(),
            'canceled' => DomainRequest::query()->where('status', DomainRequestStatus::CANCELED)->count(),
            'completed' => DomainRequest::query()->where('status', DomainRequestStatus::COMPLETED)->count(),
        ];

        return $this->successResponse([
            'summary' => [
                'domain_requests' => $this->countStats(DomainRequest::class),
                'blogs' => $this->countStats(Blog::class),
                'portfolio_items' => $this->countStats(PortfolioItem::class),
                'clients' => $this->countStats(Client::class),
                'testimonials' => $this->countStats(Testimonial::class),
                'media' => $this->countStats(Media::class),
            ],
            'domain_requests_pending' => $domainRequestsByStatus['pending'],
            'domain_requests_by_status' => $domainRequestsByStatus,
            'domain_requests_chart' => $this->monthlyChart(DomainRequest::class, 6),
            'recent_domain_requests' => DomainRequest::query()
                ->latest()
                ->limit(6)
                ->get(['id', 'domain_name', 'extension', 'email', 'phone', 'status', 'created_at'])
                ->map(function (DomainRequest $request) {
                    return [
                        'id' => $request->id,
                        'full_domain' => $request->full_domain,
                        'email' => $request->email,
                        'phone' => $request->phone,
                        'status' => $request->status?->value ?? (string) $request->status,
                        'created_at' => $request->created_at?->toIso8601String(),
                    ];
                })
                ->values(),
            'recent_activity' => Activity::query()
                ->with(['causer:id,name'])
                ->latest()
                ->limit(8)
                ->get()
                ->map(function (Activity $activity) {
                    return [
                        'id' => $activity->id,
                        'title' => (string) ($activity->description ?: $activity->event ?: 'Activity'),
                        'description' => $activity->causer?->name ?? 'System',
                        'time' => $activity->created_at?->diffForHumans() ?? '',
                        'status' => $this->mapActivityStatus((string) $activity->event),
                    ];
                })
                ->values(),
        ], 'Dashboard data retrieved successfully');
    }

    protected function countStats(string $modelClass): array
    {
        $now = now();
        $currentStart = $now->copy()->startOfMonth();
        $previousStart = $now->copy()->subMonth()->startOfMonth();
        $previousEnd = $now->copy()->subMonth()->endOfMonth();

        return [
            'total' => $modelClass::query()->count(),
            'this_month' => $modelClass::query()->where('created_at', '>=', $currentStart)->count(),
            'previous_month' => $modelClass::query()
                ->whereBetween('created_at', [$previousStart, $previousEnd])
                ->count(),
        ];
    }

    protected function monthlyChart(string $modelClass, int $months): array
    {
        $labels = [];
        $data = [];

        for ($i = $months - 1; $i >= 0; $i--) {
            $month = now()->subMonths($i);
            $labels[] = $month->format('M Y');
            $data[] = $modelClass::query()
                ->whereYear('created_at', $month->year)
                ->whereMonth('created_at', $month->month)
                ->count();
        }

        return [
            'labels' => $labels,
            'data' => $data,
        ];
    }

    protected function mapActivityStatus(string $event): string
    {
        return match ($event) {
            'created', 'updated', 'restored' => 'completed',
            'deleted', 'force_deleted' => 'pending',
            default => 'in-progress',
        };
    }
}
