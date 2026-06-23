<?php

namespace Database\Seeders;

use App\Models\PricingPlan;
use App\Models\PricingSection;
use Illuminate\Database\Seeder;

class PricingImportSeeder extends Seeder
{
    public function run(): void
    {
        $sections = require __DIR__ . '/data/pricing.php';

        foreach ($sections as $sectionData) {
            $plans = $sectionData['plans'] ?? [];
            unset($sectionData['plans']);

            $section = PricingSection::updateOrCreate(
                ['slug' => $sectionData['slug']],
                [
                    'title' => $sectionData['title'],
                    'tab_label' => $sectionData['tab_label'] ?? null,
                    'subtitle' => $sectionData['subtitle'] ?? null,
                    'sort_order' => $sectionData['sort_order'] ?? 0,
                    'is_active' => true,
                    'show_on_home' => $sectionData['show_on_home'] ?? true,
                ]
            );

            foreach ($plans as $planData) {
                PricingPlan::updateOrCreate(
                    [
                        'pricing_section_id' => $section->id,
                        'name' => $planData['name'],
                    ],
                    [
                        'price' => $planData['price'],
                        'price_period' => $planData['price_period'] ?? null,
                        'style' => $planData['style'] ?? 'standard',
                        'cta_text' => $planData['cta_text'] ?? 'Get Now',
                        'cta_url' => $planData['cta_url'] ?? null,
                        'features' => $planData['features'] ?? [],
                        'sort_order' => $planData['sort_order'] ?? 0,
                        'is_active' => true,
                    ]
                );
            }
        }
    }
}
