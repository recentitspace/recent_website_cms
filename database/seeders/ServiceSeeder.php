<?php

namespace Database\Seeders;

use App\Enums\ServiceStatus;
use App\Enums\ServiceType;
use App\Models\Service;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        $tree = [
            [
                'slug' => 'business-automation',
                'name' => 'Business Automation',
                'sort_order' => 1,
                'children' => [
                    ['slug' => 'software-development', 'name' => 'Software Development', 'pricing_category_slug' => 'netsuite', 'sort_order' => 1],
                    ['slug' => 'domain-hosting', 'name' => 'Domain Registration', 'pricing_category_slug' => 'hosting', 'sort_order' => 2],
                    ['slug' => 'website-development', 'name' => 'Web Development & Hosting', 'portfolio_category' => 'Web Development', 'pricing_category_slug' => 'hosting', 'sort_order' => 3],
                ],
            ],
            [
                'slug' => 'business-presence',
                'name' => 'Business Presence',
                'sort_order' => 2,
                'children' => [
                    ['slug' => 'brand-identity', 'name' => 'Brand Identity', 'portfolio_category' => 'Brand Identity', 'pricing_category_slug' => 'branding', 'sort_order' => 1],
                    ['slug' => 'digital-marketing', 'name' => 'Digital Marketing', 'pricing_category_slug' => 'digital-marketing', 'sort_order' => 2],
                    ['slug' => 'photo-video-production', 'name' => 'Photo & Video Production', 'portfolio_category' => 'Video Production', 'sort_order' => 3],
                ],
            ],
            [
                'slug' => 'consulting-analyzing',
                'name' => 'Consulting & Analyzing',
                'sort_order' => 3,
                'children' => [
                    ['slug' => 'data-analysis-visualization', 'name' => 'Data Analysis and Visualization', 'sort_order' => 1],
                    ['slug' => 'statistical-analysis-services', 'name' => 'Statistical Analysis Services', 'sort_order' => 2],
                    ['slug' => 'training-consulting', 'name' => 'ICT Training and Consulting', 'sort_order' => 3],
                ],
            ],
        ];

        foreach ($tree as $categoryData) {
            $children = $categoryData['children'] ?? [];
            unset($categoryData['children']);

            $category = Service::updateOrCreate(
                ['slug' => $categoryData['slug'], 'parent_id' => null],
                array_merge($categoryData, [
                    'type' => ServiceType::Category,
                    'short_name' => $categoryData['name'],
                    'status' => ServiceStatus::Published,
                    'show_in_nav' => true,
                    'show_on_homepage' => true,
                    'cta_text' => 'Get Started Today',
                    'cta_url' => '/contact',
                ])
            );

            foreach ($children as $childData) {
                Service::updateOrCreate(
                    ['slug' => $childData['slug'], 'parent_id' => $category->id],
                    array_merge($childData, [
                        'type' => ServiceType::Service,
                        'short_name' => $childData['name'],
                        'status' => ServiceStatus::Published,
                        'show_in_nav' => true,
                        'show_on_homepage' => true,
                        'cta_text' => 'Get Started Today',
                        'cta_url' => '/contact',
                    ])
                );
            }
        }
    }
}
