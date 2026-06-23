<?php

namespace Database\Seeders;

use App\Concerns\ImportsRwebMedia;
use App\Models\AboutDriveItem;
use App\Models\AboutObjective;
use App\Models\Blog;
use App\Models\Faq;
use App\Models\PageBlock;
use App\Models\ServiceCategory;
use App\Models\StatCounter;
use App\Models\WhyChooseItem;
use Illuminate\Database\Seeder;

class PageContentImportSeeder extends Seeder
{
    use ImportsRwebMedia;

    public function run(): void
    {
        $data = require __DIR__ . '/data/page_content.php';

        foreach ($data['faqs'] as $faqData) {
            Faq::updateOrCreate(
                [
                    'question' => $faqData['question'],
                    'service_category_id' => null,
                ],
                [
                    'answer_paragraphs' => $faqData['answer_paragraphs'],
                    'sort_order' => $faqData['sort_order'] ?? 0,
                    'is_active' => true,
                ]
            );
        }

        $categoryFaqs = require __DIR__ . '/data/service_category_faqs.php';

        foreach ($categoryFaqs as $slug => $faqs) {
            $category = ServiceCategory::where('slug', $slug)->first();

            if (!$category) {
                continue;
            }

            foreach ($faqs as $faqData) {
                Faq::updateOrCreate(
                    [
                        'question' => $faqData['question'],
                        'service_category_id' => $category->id,
                    ],
                    [
                        'answer_paragraphs' => $faqData['answer_paragraphs'],
                        'sort_order' => $faqData['sort_order'] ?? 0,
                        'is_active' => true,
                    ]
                );
            }
        }

        foreach ($data['stat_counters'] as $counterData) {
            $iconPath = $counterData['icon'] ?? null;
            unset($counterData['icon']);

            StatCounter::updateOrCreate(
                ['label' => $counterData['label']],
                [
                    'value' => $counterData['value'],
                    'suffix' => $counterData['suffix'] ?? null,
                    'icon_id' => $this->importMediaFromPath($iconPath, 'page-content'),
                    'sort_order' => $counterData['sort_order'] ?? 0,
                    'is_active' => true,
                    'show_on_home' => true,
                ]
            );
        }

        foreach ($data['page_blocks'] as $blockData) {
            $imagePath = $blockData['image'] ?? null;
            unset($blockData['image']);

            PageBlock::updateOrCreate(
                ['key' => $blockData['key']],
                [
                    'page' => $blockData['page'],
                    'title' => $blockData['title'] ?? null,
                    'subtitle' => $blockData['subtitle'] ?? null,
                    'body' => $blockData['body'] ?? null,
                    'image_id' => $this->importMediaFromPath($imagePath, 'page-content'),
                    'cta_text' => $blockData['cta_text'] ?? null,
                    'cta_url' => $blockData['cta_url'] ?? null,
                    'cta_secondary_text' => $blockData['cta_secondary_text'] ?? null,
                    'cta_secondary_url' => $blockData['cta_secondary_url'] ?? null,
                    'video_url' => $blockData['video_url'] ?? null,
                    'is_active' => true,
                ]
            );
        }

        foreach (require __DIR__ . '/data/why_choose_items.php' as $itemData) {
            WhyChooseItem::updateOrCreate(
                ['title' => $itemData['title']],
                [
                    'body' => $itemData['body'] ?? null,
                    'icon_id' => $this->importMediaFromPath($itemData['icon'] ?? null, 'page-content'),
                    'sort_order' => $itemData['sort_order'] ?? 0,
                    'is_active' => true,
                ]
            );
        }

        foreach (require __DIR__ . '/data/about_drive_items.php' as $itemData) {
            $imagePath = $itemData['image'] ?? null;
            unset($itemData['image']);

            AboutDriveItem::updateOrCreate(
                ['title' => $itemData['title']],
                [
                    'body' => $itemData['body'] ?? null,
                    'image_id' => $this->importMediaFromPath($imagePath, 'page-content'),
                    'bullets' => $itemData['bullets'] ?? null,
                    'sort_order' => $itemData['sort_order'] ?? 0,
                    'is_active' => true,
                ]
            );
        }

        foreach (require __DIR__ . '/data/about_objectives.php' as $itemData) {
            AboutObjective::updateOrCreate(
                ['title' => $itemData['title']],
                [
                    'body' => $itemData['body'] ?? null,
                    'sort_order' => $itemData['sort_order'] ?? 0,
                    'is_active' => true,
                ]
            );
        }

        foreach (require __DIR__ . '/data/blogs.php' as $blogData) {
            $imagePath = $blogData['featured_image'] ?? null;
            unset($blogData['featured_image']);

            Blog::updateOrCreate(
                ['slug' => $blogData['slug']],
                [
                    'title' => $blogData['title'],
                    'excerpt' => $blogData['excerpt'] ?? null,
                    'body_paragraphs' => $blogData['body_paragraphs'] ?? null,
                    'author_name' => $blogData['author_name'] ?? null,
                    'featured_image_id' => $this->importMediaFromPath($imagePath, 'page-content'),
                    'published_at' => $blogData['published_at'] ?? null,
                    'external_link' => $blogData['external_link'] ?? null,
                    'tags' => $blogData['tags'] ?? null,
                    'sort_order' => $blogData['sort_order'] ?? 0,
                    'home_sort_order' => $blogData['home_sort_order'] ?? null,
                    'show_on_home' => $blogData['show_on_home'] ?? false,
                    'is_active' => true,
                ]
            );
        }
    }
}
