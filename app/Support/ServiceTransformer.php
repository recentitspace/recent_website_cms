<?php

namespace App\Support;

use App\Models\Service;

class ServiceTransformer
{
    public static function toPublicArray(Service $service, array $includes = [], bool $minimal = false): array
    {
        if ($minimal) {
            return self::toNavigationItem($service);
        }

        $data = [
            'id' => $service->id,
            'type' => $service->type->value,
            'slug' => $service->slug,
            'name' => $service->name,
            'short_name' => $service->short_name ?? $service->name,
            'url' => $service->url,
            'show_in_nav' => $service->show_in_nav,
            'show_on_homepage' => $service->show_on_homepage,
            'sort_order' => $service->sort_order,
        ];

        if ($service->parent_id) {
            $data['parent_id'] = $service->parent_id;
        }

        if (!$minimal) {
            self::appendContentFields($data, $service, $includes);
        }

        if ($service->relationLoaded('children')) {
            $data['children'] = $service->children->map(
                fn (Service $child) => self::toPublicArray($child, $includes)
            )->values()->all();
        }

        if ($service->relationLoaded('parent') && $service->parent) {
            $data['parent'] = [
                'id' => $service->parent->id,
                'slug' => $service->parent->slug,
                'name' => $service->parent->name,
                'url' => $service->parent->url,
            ];
        }

        return $data;
    }

    public static function toNavigationItem(Service $service): array
    {
        $item = [
            'slug' => $service->slug,
            'name' => $service->name,
            'url' => $service->url,
        ];

        if ($service->icon) {
            $item['icon'] = $service->icon;
        }

        if ($service->relationLoaded('children')) {
            $item['children'] = $service->children->map(
                fn (Service $child) => self::toNavigationItem($child)
            )->values()->all();
        }

        return $item;
    }

    private static function appendContentFields(array &$data, Service $service, array $includes): void
    {
        $scalarFields = [
            'icon', 'hero_image', 'banner_title', 'banner_subtitle',
            'hero_title', 'hero_title_highlight', 'hero_description',
            'section_title', 'section_subtitle', 'cta_text', 'cta_url',
            'portfolio_category', 'pricing_category_slug',
            'meta_title', 'meta_description',
        ];

        foreach ($scalarFields as $field) {
            if ($service->{$field} !== null) {
                $data[$field] = $service->{$field};
            }
        }

        if (empty($data['cta_text'])) {
            $data['cta_text'] = 'Get Started Today';
        }
        if (empty($data['cta_url'])) {
            $data['cta_url'] = '/contact';
        }

        if (in_array('features', $includes, true) && $service->relationLoaded('features')) {
            $data['features'] = $service->features->map(fn ($feature) => [
                'id' => $feature->id,
                'label' => $feature->label,
                'sort_order' => $feature->sort_order,
                'show_in_card' => $feature->show_in_card,
            ])->values()->all();
        }

        if (in_array('process_steps', $includes, true) && $service->relationLoaded('processSteps')) {
            $data['process_steps'] = $service->processSteps->map(fn ($step) => [
                'id' => $step->id,
                'step_number' => $step->step_number,
                'title' => $step->title,
                'description' => $step->description,
                'tasks' => $step->tasks ?? [],
                'sort_order' => $step->sort_order,
            ])->values()->all();
        }

        if (in_array('faqs', $includes, true) && $service->relationLoaded('faqs')) {
            $data['faqs'] = $service->faqs->map(fn ($faq) => [
                'id' => $faq->id,
                'question' => $faq->question,
                'answer' => $faq->answer,
                'sort_order' => $faq->sort_order,
            ])->values()->all();
        }
    }

    public static function parseIncludes(?string $include): array
    {
        if (!$include) {
            return [];
        }

        return array_values(array_intersect(
            array_map('trim', explode(',', $include)),
            ['features', 'process_steps', 'faqs']
        ));
    }
}
