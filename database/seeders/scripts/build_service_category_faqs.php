<?php

/**
 * Extract service category FAQ accordion items from R-web blades.
 * Run: php database/seeders/scripts/build_service_category_faqs.php
 */

$base = dirname(__DIR__, 3);
$rweb = $base . '/../R-web/resources/views/services';

$categories = [
    'business-automation' => 'business-automation/index.blade.php',
    'business-presence' => 'business-presence/index.blade.php',
    'consulting-analyzing' => 'consulting-analyzing/index.blade.php',
];

function extractCategoryFaqs(string $html): array
{
    $faqs = [];

    if (!preg_match_all(
        '/<button class="accordion-button[^"]*"[^>]*>\\s*(.*?)\\s*<\\/button>[\\s\\S]*?<p class="disc">\\s*(.*?)\\s*<\\/p>/s',
        $html,
        $matches,
        PREG_SET_ORDER
    )) {
        return $faqs;
    }

    foreach ($matches as $index => $match) {
        $question = trim(html_entity_decode(strip_tags($match[1])));
        $answer = trim(html_entity_decode(strip_tags($match[2])));

        if ($question === '' || $answer === '') {
            continue;
        }

        $faqs[] = [
            'question' => $question,
            'answer_paragraphs' => [$answer],
            'sort_order' => $index + 1,
        ];
    }

    return $faqs;
}

$output = [];

foreach ($categories as $slug => $path) {
    $html = file_get_contents($rweb . '/' . $path);
    $output[$slug] = extractCategoryFaqs($html);
}

$content = "<?php\n\nreturn " . var_export($output, true) . ";\n";
file_put_contents(dirname(__DIR__) . '/data/service_category_faqs.php', $content);
echo "Wrote service_category_faqs.php\n";
