<?php

namespace Database\Seeders;

use App\Concerns\ImportsRwebMedia;
use App\Models\ServiceCategory;
use App\Models\ServiceItem;
use Illuminate\Database\Seeder;

class ServicesImportSeeder extends Seeder
{
    use ImportsRwebMedia;

    public function run(): void
    {
        $categories = require __DIR__ . '/data/services.php';
        $details = require __DIR__ . '/data/service_details.php';
        $categoryDetails = $details['categories'] ?? [];
        $itemDetails = $details['items'] ?? [];

        foreach ($categories as $categoryData) {
            $items = $categoryData['items'] ?? [];
            $iconPath = $categoryData['icon'] ?? null;
            $heroImagePath = $categoryData['hero_image'] ?? null;
            $slug = $categoryData['slug'];
            unset($categoryData['items'], $categoryData['icon'], $categoryData['hero_image']);

            $categoryProcess = $categoryDetails[$slug] ?? [];

            $category = ServiceCategory::updateOrCreate(
                ['slug' => $slug],
                [
                    'title' => $categoryData['title'],
                    'icon_id' => $this->importMediaFromPath($iconPath, 'services'),
                    'hero_image_id' => $this->importMediaFromPath($heroImagePath, 'services'),
                    'hero_title' => $categoryData['hero_title'] ?? null,
                    'description' => $categoryData['description'] ?? null,
                    'listing_subtitle' => $categoryData['listing_subtitle'] ?? null,
                    'page_path' => $categoryData['page_path'],
                    'cta_text' => $categoryData['cta_text'] ?? 'Get started',
                    'process_title' => $categoryProcess['process_title'] ?? null,
                    'process_subtitle' => $categoryProcess['process_subtitle'] ?? null,
                    'process_steps' => $categoryProcess['process_steps'] ?? null,
                    'sort_order' => $categoryData['sort_order'] ?? 0,
                    'is_active' => true,
                    'show_on_home' => $categoryData['show_on_home'] ?? true,
                ]
            );

            foreach ($items as $itemData) {
                $itemSlug = $itemData['slug'];
                $detail = $itemDetails[$itemSlug] ?? [];
                $detailHeroImage = $detail['hero_image'] ?? null;
                unset($detail['hero_image']);

                ServiceItem::updateOrCreate(
                    [
                        'service_category_id' => $category->id,
                        'slug' => $itemSlug,
                    ],
                    [
                        'title' => $itemData['title'],
                        'icon_id' => $this->importMediaFromPath($iconPath, 'services'),
                        'page_path' => $itemData['page_path'],
                        'highlights' => $itemData['highlights'] ?? [],
                        'detail_hero_title' => $detail['detail_hero_title'] ?? null,
                        'detail_hero_description' => $detail['detail_hero_description'] ?? null,
                        'hero_image_id' => $this->importMediaFromPath($detailHeroImage, 'services'),
                        'process_title' => $detail['process_title'] ?? null,
                        'process_subtitle' => $detail['process_subtitle'] ?? null,
                        'process_steps' => $detail['process_steps'] ?? null,
                        'sort_order' => $itemData['sort_order'] ?? 0,
                        'is_active' => true,
                        'show_on_home' => true,
                    ]
                );
            }
        }
    }
}
