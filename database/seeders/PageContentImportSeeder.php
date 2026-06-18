<?php

namespace Database\Seeders;

use App\Concerns\ImportsRwebMedia;
use App\Models\Faq;
use App\Models\PageBlock;
use App\Models\PageBlockItem;
use App\Models\StatCounter;
use Illuminate\Database\Seeder;

class PageContentImportSeeder extends Seeder
{
    use ImportsRwebMedia;

    public function run(): void
    {
        $data = require __DIR__ . '/data/page_content.php';

        foreach ($data['faqs'] as $faqData) {
            Faq::updateOrCreate(
                ['question' => $faqData['question']],
                [
                    'answer_paragraphs' => $faqData['answer_paragraphs'],
                    'sort_order' => $faqData['sort_order'] ?? 0,
                    'is_active' => true,
                ]
            );
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
            $items = $blockData['items'] ?? [];
            $imagePath = $blockData['image'] ?? null;
            unset($blockData['items'], $blockData['image']);

            $block = PageBlock::updateOrCreate(
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
                    'sort_order' => $blockData['sort_order'] ?? 0,
                    'is_active' => true,
                ]
            );

            foreach ($items as $itemData) {
                $itemImagePath = $itemData['image'] ?? null;
                unset($itemData['image']);

                PageBlockItem::updateOrCreate(
                    [
                        'page_block_id' => $block->id,
                        'title' => $itemData['title'],
                    ],
                    [
                        'body' => $itemData['body'] ?? null,
                        'image_id' => $this->importMediaFromPath($itemImagePath, 'page-content'),
                        'bullets' => $itemData['bullets'] ?? null,
                        'sort_order' => $itemData['sort_order'] ?? 0,
                        'is_active' => true,
                    ]
                );
            }
        }
    }
}
