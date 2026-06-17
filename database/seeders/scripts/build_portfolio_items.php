<?php

/**
 * One-off script: parses R-web PortfolioController and writes portfolio_items.php
 * Run: php database/seeders/scripts/build_portfolio_items.php
 */

$rwebFile = dirname(__DIR__, 4) . '/R-web/app/Http/Controllers/PortfolioController.php';
$content = file_get_contents($rwebFile);

if (!preg_match('/protected function getAllPortfolioItems\(\)\s*\{[\s\S]*?return \[(([\s\S]*?))\];\s*\}/', $content, $match)) {
    fwrite(STDERR, "Could not parse portfolio items\n");
    exit(1);
}

$body = $match[1];
$body = preg_replace("/route\('portfolio\.project',\s*'([^']+)'\)/", "'__PROJECT__$1'", $body);
$body = preg_replace(
    '/\$this->createYouTubeVideoItem\(\s*"([^"]+)",\s*"([^"]+)",\s*"([^"]+)",\s*"([^"]+)",\s*"([^"]+)",\s*(true|false)\s*\)/',
    '["title"=>"$1","tags"=>"$2","youtube_url"=>"$3","category"=>"$4","image"=>"$5","type"=>"video","featured"=>$6]',
    $body
);

$items = eval('return [' . $body . '];');

if (!is_array($items)) {
    fwrite(STDERR, "Failed to evaluate items\n");
    exit(1);
}

$normalized = [];
$usedSlugs = [];

foreach ($items as $index => $item) {
    $link = isset($item['link']) ? trim($item['link']) : null;
    $externalLink = null;

    if ($link && str_starts_with($link, 'http')) {
        $externalLink = preg_replace('/\s+/', '', $link);
    }

    $type = $item['type'] ?? 'image';
    if ($type === 'project' && !empty($item['slug'])) {
        $baseSlug = $item['slug'];
    } elseif (!empty($item['slug']) && $type === 'image' && $item['slug'] === 'centralBank') {
        // Keep canonical centralBank slug only for CBS Brand Manual
        $baseSlug = ($item['title'] === 'CBS Brand Manual') ? 'centralBank' : slugify($item['title']);
    } else {
        $baseSlug = slugify($item['title']);
    }

    $slug = $baseSlug;
    $counter = 1;
    while (in_array($slug, $usedSlugs, true)) {
        $slug = $baseSlug . '-' . $counter;
        $counter++;
    }
    $usedSlugs[] = $slug;

    $row = [
        'title' => $item['title'],
        'tags' => $item['tags'] ?? null,
        'category' => $item['category'],
        'type' => $type,
        'image' => $item['image'] ?? ($item['thumbnail'] ?? null),
        'featured' => $item['featured'] ?? false,
        'sort_order' => $index + 1,
        'slug' => $slug,
    ];

    if ($externalLink) {
        $row['external_link'] = $externalLink;
    }

    if (!empty($item['youtube_url'])) {
        $row['youtube_url'] = $item['youtube_url'];
    }

    $normalized[] = $row;
}

function slugify(string $title): string
{
    $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $title), '-'));

    return $slug !== '' ? $slug : 'item';
}

$output = "<?php\n\nreturn " . var_export($normalized, true) . ";\n";
$dest = dirname(__DIR__) . '/data/portfolio_items.php';
if (!is_dir(dirname($dest))) {
    mkdir(dirname($dest), 0755, true);
}
file_put_contents($dest, $output);
echo 'Wrote ' . count($normalized) . ' items to ' . $dest . PHP_EOL;
