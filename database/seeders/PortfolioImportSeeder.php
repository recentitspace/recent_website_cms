<?php

namespace Database\Seeders;

use App\Concerns\ImportsRwebMedia;
use App\Models\PortfolioCategory;
use App\Models\PortfolioItem;
use App\Models\PortfolioItemImage;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PortfolioImportSeeder extends Seeder
{
    use ImportsRwebMedia;
    public function run(): void
    {
        $categories = [
            ['name' => 'Brand Identity', 'slug' => 'brand-identity', 'sort_order' => 1],
            ['name' => 'Web Development', 'slug' => 'web-development', 'sort_order' => 2],
            ['name' => 'Video Production', 'slug' => 'video-production', 'sort_order' => 3],
            ['name' => 'Software Solutions', 'slug' => 'software-solutions', 'sort_order' => 4],
            ['name' => 'Mobile App Development', 'slug' => 'mobile-app-development', 'sort_order' => 5],
            ['name' => 'Digital Marketing', 'slug' => 'digital-marketing', 'sort_order' => 6],
        ];

        $categoryMap = [];
        foreach ($categories as $categoryData) {
            $category = PortfolioCategory::firstOrCreate(
                ['slug' => $categoryData['slug']],
                [
                    'name' => $categoryData['name'],
                    'sort_order' => $categoryData['sort_order'],
                    'is_active' => true,
                ]
            );
            $categoryMap[$categoryData['name']] = $category->id;
        }

        $items = require __DIR__ . '/data/portfolio_items.php';
        $galleries = file_exists(__DIR__ . '/data/portfolio_galleries.php')
            ? require __DIR__ . '/data/portfolio_galleries.php'
            : [];

        $this->cleanupImportDuplicates();

        $homeSlugs = [
            'nmdc',
            'ecosom',
            'lebixpress',
            'somalia-blue-economy',
            'midnimo-hospital',
            'norways-national-day',
        ];

        foreach ($items as $index => $itemData) {
            $categoryName = $itemData['category'];
            if (!isset($categoryMap[$categoryName])) {
                continue;
            }

            $categoryId = $categoryMap[$categoryName];
            $slug = $itemData['slug'] ?? Str::slug($itemData['title']);

            $externalLink = $itemData['external_link'] ?? null;
            if (!$externalLink && !empty($itemData['link'])) {
                $link = trim($itemData['link']);
                if (str_starts_with($link, 'http')) {
                    $externalLink = preg_replace('/\s+/', '', $link);
                }
            }

            $thumbnailId = $this->importMediaFromPath(
                $itemData['image'] ?? ($itemData['thumbnail'] ?? null)
            );

            $portfolioItem = PortfolioItem::updateOrCreate(
                [
                    'title' => $itemData['title'],
                    'portfolio_category_id' => $categoryId,
                ],
                [
                    'slug' => $slug,
                    'tags' => $itemData['tags'] ?? null,
                    'type' => $itemData['type'] ?? 'image',
                    'thumbnail_id' => $thumbnailId,
                    'external_link' => $externalLink,
                    'youtube_url' => $itemData['youtube_url'] ?? null,
                    'featured' => $itemData['featured'] ?? false,
                    'sort_order' => $itemData['sort_order'] ?? ($index + 1),
                    'is_published' => true,
                    'show_on_home' => in_array($slug, $homeSlugs, true),
                    'home_sort_order' => in_array($slug, $homeSlugs, true) ? array_search($slug, $homeSlugs, true) + 1 : null,
                ]
            );

            if (empty($externalLink) && ($portfolioItem->type === 'image' || $portfolioItem->type === 'project')) {
                $gallerySlug = $this->resolveGallerySlug($slug, $portfolioItem->type);
                $imagePaths = $galleries[$gallerySlug] ?? [];
                $this->syncPortfolioGallery($portfolioItem, $imagePaths);
            } else {
                PortfolioItemImage::where('portfolio_item_id', $portfolioItem->id)->delete();
            }
        }
    }

    protected function cleanupImportDuplicates(): void
    {
        $items = PortfolioItem::withTrashed()->get()->groupBy(
            fn (PortfolioItem $item) => $item->title . '|' . $item->portfolio_category_id
        );

        foreach ($items as $group) {
            if ($group->count() <= 1) {
                continue;
            }

            $keep = $group
                ->sortBy(fn (PortfolioItem $item) => preg_match('/-\d+$/', $item->slug) ? 1 : 0)
                ->sortBy('id')
                ->first();

            $group->where('id', '!=', $keep->id)->each(function (PortfolioItem $item) {
                $this->deletePortfolioItem($item);
            });
        }

        $expectedCount = count(require __DIR__ . '/data/portfolio_items.php');
        $extra = PortfolioItem::count() - $expectedCount;

        if ($extra > 0) {
            $canonicalSlugs = collect(require __DIR__ . '/data/portfolio_items.php')
                ->pluck('slug')
                ->filter()
                ->values()
                ->all();

            PortfolioItem::query()
                ->whereNotIn('slug', $canonicalSlugs)
                ->where('slug', 'regexp', '-[0-9]+$')
                ->each(fn (PortfolioItem $item) => $this->deletePortfolioItem($item));
        }
    }

    protected function deletePortfolioItem(PortfolioItem $item): void
    {
        PortfolioItemImage::where('portfolio_item_id', $item->id)->delete();
        $item->forceDelete();
    }

    protected function resolveGallerySlug(string $slug, string $type): string
    {
        // Website project kept canonical R-web slug while brand item uses `kobciye`
        if ($slug === 'kobciye-1' && $type === 'project') {
            return 'kobciye';
        }

        return $slug;
    }

    protected function syncPortfolioGallery(PortfolioItem $item, array $imagePaths): void
    {
        PortfolioItemImage::where('portfolio_item_id', $item->id)->delete();

        if ($imagePaths === []) {
            return;
        }

        foreach ($imagePaths as $index => $relativePath) {
            $mediaId = $this->importMediaFromPath($relativePath);
            if (!$mediaId) {
                continue;
            }

            PortfolioItemImage::create([
                'portfolio_item_id' => $item->id,
                'media_id' => $mediaId,
                'sort_order' => $index + 1,
            ]);
        }
    }
}
