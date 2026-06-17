<?php

/**
 * Parses R-web project blade views and writes portfolio_galleries.php
 * Run: php database/seeders/scripts/build_portfolio_galleries.php
 */

$viewsDir = dirname(__DIR__, 4) . '/R-web/resources/views/work/projects';

if (!is_dir($viewsDir)) {
    fwrite(STDERR, "Project views directory not found: {$viewsDir}\n");
    exit(1);
}

$galleries = [];

foreach (glob($viewsDir . '/*.blade.php') as $file) {
    $slug = basename($file, '.blade.php');
    $content = file_get_contents($file);

    if (!preg_match_all("/asset\('([^']+)'\)/", $content, $matches)) {
        continue;
    }

    $images = array_values(array_unique($matches[1]));

    if ($images !== []) {
        $galleries[$slug] = $images;
    }
}

$output = "<?php\n\nreturn " . var_export($galleries, true) . ";\n";
$dest = dirname(__DIR__) . '/data/portfolio_galleries.php';

if (!is_dir(dirname($dest))) {
    mkdir(dirname($dest), 0755, true);
}

file_put_contents($dest, $output);
echo 'Wrote galleries for ' . count($galleries) . ' projects to ' . $dest . PHP_EOL;
