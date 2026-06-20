<?php

/**
 * One-off: extracts service detail seed data from R-web blades.
 * Run: php database/seeders/scripts/build_service_details.php
 */

$base = dirname(__DIR__, 3);
$rweb = $base . '/../R-web/resources/views/services';

$items = [
    'software-development' => 'business-automation/software-development.blade.php',
    'domain-hosting' => 'business-automation/domain-hosting.blade.php',
    'website-development' => 'business-automation/website-development.blade.php',
    'brand-identity' => 'business-presence/brand-Identity.blade.php',
    'digital-marketing' => 'business-presence/digital-marketing.blade.php',
    'photo-video-production' => 'business-presence/photo-video-production.blade.php',
    'data-analysis-visualization' => 'consulting-analyzing/data-analysis-visualization.blade.php',
    'statistical-analysis-services' => 'consulting-analyzing/statistical-analysis-services.blade.php',
    'training-consulting' => 'consulting-analyzing/training-consulting.blade.php',
];

$categories = [
    'business-automation' => 'business-automation/index.blade.php',
    'business-presence' => 'business-presence/index.blade.php',
    'consulting-analyzing' => 'consulting-analyzing/index.blade.php',
];

function extractBreadcrumb(string $html): array
{
    if (!preg_match('/single-case-studies-bread-crumb-area[\\s\\S]*?<h1[^>]*>(.*?)<\\/h1>/s', $html, $titleMatch)) {
        return ['title' => null, 'description' => null];
    }
    $title = trim(strip_tags(str_replace(['<br>', '<br/>', '<br />'], ' ', $titleMatch[1])));
    $description = null;
    if (preg_match('/single-case-studies-bread-crumb-area[\\s\\S]*?<p class="disc">\\s*(.*?)\\s*<\\/p>/s', $html, $descMatch)) {
        $description = trim(strip_tags($descMatch[1]));
    }

    return ['title' => $title, 'description' => $description];
}

function extractProcess(string $html): array
{
    $result = [
        'process_title' => 'Our Process',
        'process_subtitle' => null,
        'process_steps' => [],
    ];

    if (preg_match('/<h2[^>]*>\\s*Our Process\\s*<\\/h2>[\\s\\S]*?<span class="pre[^"]*">\\s*(.*?)\\s*<\\/span>/s', $html, $subMatch)) {
        $result['process_subtitle'] = trim(strip_tags(str_replace(['<br>', '<br/>', '<br />'], ' ', $subMatch[1])));
    }

    if (preg_match_all('/<div class="step-content-card">\\s*<h3>(.*?)<\\/h3>\\s*<p>\\s*(.*?)\\s*<\\/p>\\s*<div class="tasks-involved">[\\s\\S]*?<div class="task-tags">([\\s\\S]*?)<\\/div>/s', $html, $steps, PREG_SET_ORDER)) {
        foreach ($steps as $step) {
            $tasks = [];
            if (preg_match_all('/<span>(.*?)<\\/span>/s', $step[3], $taskMatches)) {
                foreach ($taskMatches[1] as $task) {
                    $tasks[] = trim(html_entity_decode(strip_tags($task)));
                }
            }
            $result['process_steps'][] = [
                'title' => trim(strip_tags($step[1])),
                'description' => trim(strip_tags($step[2])),
                'tasks' => $tasks,
            ];
        }
    } elseif (preg_match_all('/<h3>(.*?)<\\/h3>\\s*<p>\\s*(.*?)\\s*<\\/p>\\s*<div class="tasks-involved">[\\s\\S]*?<div class="task-tags">([\\s\\S]*?)<\\/div>/s', $html, $steps, PREG_SET_ORDER)) {
        foreach ($steps as $step) {
            $tasks = [];
            if (preg_match_all('/<span>(.*?)<\\/span>/s', $step[3], $taskMatches)) {
                foreach ($taskMatches[1] as $task) {
                    $tasks[] = trim(html_entity_decode(strip_tags($task)));
                }
            }
            $result['process_steps'][] = [
                'title' => trim(strip_tags($step[1])),
                'description' => trim(strip_tags($step[2])),
                'tasks' => $tasks,
            ];
        }
    } elseif (preg_match_all('/<div class="single-working-process[^"]*">[\\s\\S]*?<h4 class="title">(.*?)<\\/h4>\\s*<p class="disc">\\s*(.*?)\\s*<\\/p>/s', $html, $steps, PREG_SET_ORDER)) {
        foreach ($steps as $step) {
            $result['process_steps'][] = [
                'title' => trim(strip_tags(str_replace(['<br>', '<br/>', '<br />'], ' ', $step[1]))),
                'description' => trim(strip_tags(str_replace(['<br>', '<br/>', '<br />'], ' ', $step[2]))),
            ];
        }
    }

    return $result;
}

function extractDomainExtensions(string $html): array
{
    $extensions = [];

    if (!preg_match('/<div class="domain-price-card[^"]*">([\\s\\S]*?)<\\/div>\\s*<div class="row g-24">/s', $html, $cardMatch)) {
        return $extensions;
    }

    if (!preg_match_all('/<span class="domain-title">([^<]+)<\\/span>([\\s\\S]*?)<span class="domain-price">\\$?([^<]+)<\\/span>[\\s\\S]*?<span class="domain-period">\\/?([^<]+)<\\/span>/s', $cardMatch[1], $matches, PREG_SET_ORDER)) {
        return $extensions;
    }

    foreach ($matches as $match) {
        $badge = null;
        if (preg_match('/<span class="domain-badge">([^<]+)<\\/span>/', $match[2], $badgeMatch)) {
            $badge = trim(strip_tags($badgeMatch[1]));
        }

        $entry = [
            'extension' => trim($match[1]),
            'price' => trim($match[3]),
            'period' => trim($match[4]),
        ];
        if ($badge) {
            $entry['badge'] = $badge;
        }
        $extensions[] = $entry;
    }

    return $extensions;
}

$output = ['categories' => [], 'items' => []];

foreach ($categories as $slug => $path) {
    $html = file_get_contents($rweb . '/' . $path);
    $process = extractProcess($html);
    $output['categories'][$slug] = [
        'process_title' => $process['process_title'],
        'process_subtitle' => $process['process_subtitle'],
        'process_steps' => array_map(fn ($s) => [
            'title' => $s['title'],
            'description' => $s['description'],
        ], $process['process_steps']),
    ];
}

foreach ($items as $slug => $path) {
    $html = file_get_contents($rweb . '/' . $path);
    $breadcrumb = extractBreadcrumb($html);
    $process = extractProcess($html);

    $heroImage = null;
    if (preg_match('/assets\\/images\\/[^"\']+/', $html, $imgMatch)) {
        $heroImage = $imgMatch[0];
    }

    $output['items'][$slug] = array_merge([
        'detail_hero_title' => $breadcrumb['title'],
        'detail_hero_description' => $breadcrumb['description'],
        'hero_image' => $heroImage,
    ], $process);

    $domainExtensions = extractDomainExtensions($html);
    if (!empty($domainExtensions)) {
        $output['items'][$slug]['domain_extensions'] = $domainExtensions;
    }
}

$content = "<?php\n\nreturn " . var_export($output, true) . ";\n";

file_put_contents(dirname(__DIR__) . '/data/service_details.php', $content);
echo "Wrote service_details.php\n";
