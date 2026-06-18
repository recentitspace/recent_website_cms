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

        foreach ($categories as $categoryData) {
            $items = $categoryData['items'] ?? [];
            $iconPath = $categoryData['icon'] ?? null;
            $heroImagePath = $categoryData['hero_image'] ?? null;
            unset($categoryData['items'], $categoryData['icon'], $categoryData['hero_image']);

            $category = ServiceCategory::updateOrCreate(
                ['slug' => $categoryData['slug']],
                [
                    'title' => $categoryData['title'],
                    'icon_id' => $this->importMediaFromPath($iconPath, 'services'),
                    'hero_image_id' => $this->importMediaFromPath($heroImagePath, 'services'),
                    'hero_title' => $categoryData['hero_title'] ?? null,
                    'description' => $categoryData['description'] ?? null,
                    'listing_subtitle' => $categoryData['listing_subtitle'] ?? null,
                    'page_path' => $categoryData['page_path'],
                    'cta_text' => $categoryData['cta_text'] ?? 'Get started',
                    'sort_order' => $categoryData['sort_order'] ?? 0,
                    'is_active' => true,
                    'show_on_home' => $categoryData['show_on_home'] ?? true,
                ]
            );

            foreach ($items as $itemData) {
                ServiceItem::updateOrCreate(
                    [
                        'service_category_id' => $category->id,
                        'slug' => $itemData['slug'],
                    ],
                    [
                        'title' => $itemData['title'],
                        'icon_id' => $this->importMediaFromPath($iconPath, 'services'),
                        'page_path' => $itemData['page_path'],
                        'highlights' => $itemData['highlights'] ?? [],
                        'sort_order' => $itemData['sort_order'] ?? 0,
                        'is_active' => true,
                        'show_on_home' => true,
                    ]
                );
            }
        }
    }
}
