<?php

namespace App\Http\Controllers\Api;

use App\Enums\DomainRequestStatus;
use App\Models\AboutDriveItem;
use App\Models\AboutObjective;
use App\Models\Blog;
use App\Models\Client;
use App\Models\DomainExtension;
use App\Models\DomainRequest;
use App\Models\Faq;
use App\Models\Media;
use App\Models\PageBlock;
use App\Models\PortfolioCategory;
use App\Models\PortfolioItem;
use App\Models\PricingPlan;
use App\Models\PricingSection;
use App\Models\ServiceCategory;
use App\Models\ServiceItem;
use App\Models\SocialLink;
use App\Models\StatCounter;
use App\Models\Testimonial;
use App\Models\WhyChooseItem;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;
use Spatie\Activitylog\Models\Activity;

class DashboardController extends Controller
{
    use ApiResponseTrait;

  /** @var array<string, class-string> */
    protected array $summaryModels = [
        'media' => Media::class,
        'social_links' => SocialLink::class,
        'portfolio_categories' => PortfolioCategory::class,
        'portfolio_items' => PortfolioItem::class,
        'blogs' => Blog::class,
        'clients' => Client::class,
        'testimonials' => Testimonial::class,
        'pricing_sections' => PricingSection::class,
        'pricing_plans' => PricingPlan::class,
        'domain_extensions' => DomainExtension::class,
        'domain_requests' => DomainRequest::class,
        'service_categories' => ServiceCategory::class,
        'service_items' => ServiceItem::class,
        'faqs' => Faq::class,
        'page_blocks' => PageBlock::class,
        'stat_counters' => StatCounter::class,
        'why_choose_items' => WhyChooseItem::class,
        'about_drive_items' => AboutDriveItem::class,
        'about_objectives' => AboutObjective::class,
    ];

    public function index(): JsonResponse
    {
        $summary = [];
        foreach ($this->summaryModels as $key => $modelClass) {
            $summary[$key] = $this->countStats($modelClass);
        }

        $activeCounts = [];
        foreach ($this->summaryModels as $key => $modelClass) {
            $activeCounts[$key] = $this->activeCount($modelClass);
        }

        $totalContent = array_sum(array_column($summary, 'total'));
        $createdThisMonth = array_sum(array_column($summary, 'this_month'));

        return $this->successResponse([
            'overview' => [
                'total_content' => $totalContent,
                'created_this_month' => $createdThisMonth,
                'active_items' => array_sum($activeCounts),
                'pending_domain_requests' => DomainRequest::query()
                    ->where('status', DomainRequestStatus::PENDING)
                    ->count(),
            ],
            'summary' => $summary,
            'active_counts' => $activeCounts,
            'content_by_type' => $this->contentByType($summary),
            'content_chart' => $this->aggregateMonthlyChart(6),
            'content_groups' => $this->contentGroups($summary, $activeCounts),
            'recent_updates' => $this->recentUpdates(10),
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

    protected function activeCount(string $modelClass): int
    {
        $model = new $modelClass();

        if (!in_array('is_active', $model->getFillable(), true)) {
            return $modelClass::query()->count();
        }

        return $modelClass::query()->where('is_active', true)->count();
    }

    protected function contentByType(array $summary): array
    {
        $groups = [
            ['label' => 'Media', 'key' => 'media'],
            ['label' => 'Portfolio', 'key' => 'portfolio_items'],
            ['label' => 'Blogs', 'key' => 'blogs'],
            ['label' => 'Services', 'key' => 'service_items'],
            ['label' => 'Page Blocks', 'key' => 'page_blocks'],
            ['label' => 'FAQs', 'key' => 'faqs'],
            ['label' => 'Clients', 'key' => 'clients'],
            ['label' => 'Testimonials', 'key' => 'testimonials'],
            ['label' => 'Pricing Plans', 'key' => 'pricing_plans'],
            ['label' => 'Domain Extensions', 'key' => 'domain_extensions'],
            ['label' => 'Domain Requests', 'key' => 'domain_requests'],
        ];

        return collect($groups)
            ->map(fn (array $group) => [
                'label' => $group['label'],
                'count' => (int) ($summary[$group['key']]['total'] ?? 0),
            ])
            ->filter(fn (array $item) => $item['count'] > 0)
            ->values()
            ->all();
    }

    protected function aggregateMonthlyChart(int $months): array
    {
        $labels = [];
        $data = [];

        for ($i = $months - 1; $i >= 0; $i--) {
            $month = now()->subMonths($i);
            $labels[] = $month->format('M Y');

            $count = 0;
            foreach ($this->summaryModels as $modelClass) {
                $count += $modelClass::query()
                    ->whereYear('created_at', $month->year)
                    ->whereMonth('created_at', $month->month)
                    ->count();
            }

            $data[] = $count;
        }

        return [
            'labels' => $labels,
            'data' => $data,
        ];
    }

    protected function contentGroups(array $summary, array $activeCounts): array
    {
        return [
            [
                'title' => 'Site & Media',
                'items' => [
                    $this->groupItem('Media', $summary, $activeCounts, 'media', '/media'),
                    $this->groupItem('Social Links', $summary, $activeCounts, 'social_links', '/social-links'),
                ],
            ],
            [
                'title' => 'Portfolio',
                'items' => [
                    $this->groupItem('Categories', $summary, $activeCounts, 'portfolio_categories', '/portfolio-categories'),
                    $this->groupItem('Projects', $summary, $activeCounts, 'portfolio_items', '/portfolio-items'),
                ],
            ],
            [
                'title' => 'Marketing',
                'items' => [
                    $this->groupItem('Blogs', $summary, $activeCounts, 'blogs', '/blogs'),
                    $this->groupItem('Clients', $summary, $activeCounts, 'clients', '/clients'),
                    $this->groupItem('Testimonials', $summary, $activeCounts, 'testimonials', '/testimonials'),
                ],
            ],
            [
                'title' => 'Services',
                'items' => [
                    $this->groupItem('Categories', $summary, $activeCounts, 'service_categories', '/service-categories'),
                    $this->groupItem('Service Items', $summary, $activeCounts, 'service_items', '/service-items'),
                ],
            ],
            [
                'title' => 'Pricing & Domains',
                'items' => [
                    $this->groupItem('Pricing Sections', $summary, $activeCounts, 'pricing_sections', '/pricing-sections'),
                    $this->groupItem('Pricing Plans', $summary, $activeCounts, 'pricing_plans', '/pricing-plans'),
                    $this->groupItem('Domain Extensions', $summary, $activeCounts, 'domain_extensions', '/domain-extensions'),
                    $this->groupItem('Domain Requests', $summary, $activeCounts, 'domain_requests', '/domain-requests', false),
                ],
            ],
            [
                'title' => 'Pages & Content Blocks',
                'items' => [
                    $this->groupItem('Page Blocks', $summary, $activeCounts, 'page_blocks', '/page-blocks'),
                    $this->groupItem('FAQs', $summary, $activeCounts, 'faqs', '/faqs'),
                    $this->groupItem('Stat Counters', $summary, $activeCounts, 'stat_counters', '/stat-counters'),
                    $this->groupItem('Why Choose Items', $summary, $activeCounts, 'why_choose_items', '/why-choose-items'),
                    $this->groupItem('About Drive Items', $summary, $activeCounts, 'about_drive_items', '/about-drive-items'),
                    $this->groupItem('About Objectives', $summary, $activeCounts, 'about_objectives', '/about-objectives'),
                ],
            ],
        ];
    }

    protected function groupItem(
        string $label,
        array $summary,
        array $activeCounts,
        string $key,
        string $path,
        bool $showActive = true,
    ): array {
        return [
            'label' => $label,
            'total' => (int) ($summary[$key]['total'] ?? 0),
            'active' => $showActive ? (int) ($activeCounts[$key] ?? 0) : null,
            'this_month' => (int) ($summary[$key]['this_month'] ?? 0),
            'path' => $path,
        ];
    }

    protected function recentUpdates(int $limit): array
    {
        $items = collect();

        Blog::query()->latest()->limit(3)->get(['id', 'title', 'created_at'])->each(
            fn (Blog $blog) => $items->push([
                'id' => $blog->id,
                'type' => 'blog',
                'label' => 'Blog',
                'title' => $blog->title,
                'path' => '/blogs?view=' . $blog->id,
                'created_at' => $blog->created_at?->toIso8601String(),
            ])
        );

        PortfolioItem::query()->latest()->limit(3)->get(['id', 'title', 'created_at'])->each(
            fn (PortfolioItem $item) => $items->push([
                'id' => $item->id,
                'type' => 'portfolio_item',
                'label' => 'Portfolio',
                'title' => $item->title,
                'path' => '/portfolio-items?view=' . $item->id,
                'created_at' => $item->created_at?->toIso8601String(),
            ])
        );

        ServiceItem::query()->latest()->limit(3)->get(['id', 'title', 'created_at'])->each(
            fn (ServiceItem $item) => $items->push([
                'id' => $item->id,
                'type' => 'service_item',
                'label' => 'Service',
                'title' => $item->title,
                'path' => '/service-items?view=' . $item->id,
                'created_at' => $item->created_at?->toIso8601String(),
            ])
        );

        PageBlock::query()->latest()->limit(3)->get(['id', 'title', 'page', 'key', 'created_at'])->each(
            fn (PageBlock $block) => $items->push([
                'id' => $block->id,
                'type' => 'page_block',
                'label' => 'Page Block',
                'title' => $block->title ?: ($block->page . ' / ' . $block->key),
                'path' => '/page-blocks?view=' . $block->id,
                'created_at' => $block->created_at?->toIso8601String(),
            ])
        );

        DomainRequest::query()->latest()->limit(3)->get(['id', 'domain_name', 'extension', 'created_at'])->each(
            fn (DomainRequest $request) => $items->push([
                'id' => $request->id,
                'type' => 'domain_request',
                'label' => 'Domain Request',
                'title' => $request->full_domain,
                'path' => '/domain-requests?view=' . $request->id,
                'created_at' => $request->created_at?->toIso8601String(),
            ])
        );

        Client::query()->latest()->limit(2)->get(['id', 'name', 'created_at'])->each(
            fn (Client $client) => $items->push([
                'id' => $client->id,
                'type' => 'client',
                'label' => 'Client',
                'title' => $client->name,
                'path' => '/clients?view=' . $client->id,
                'created_at' => $client->created_at?->toIso8601String(),
            ])
        );

        return $items
            ->filter(fn (array $item) => !empty($item['created_at']))
            ->sortByDesc('created_at')
            ->take($limit)
            ->values()
            ->all();
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
