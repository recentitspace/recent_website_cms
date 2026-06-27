<?php

$entries = [];

// About page brand slider — light theme row (R-web about.blade.php)
for ($i = 1; $i <= 15; $i++) {
    $entries[] = [
        'name' => 'Brand Logo ' . $i,
        'image' => sprintf('assets/images/brand/Logos-%02d.png', $i),
        'sort_order' => $i,
        'show_on_home' => false,
    ];
}

// Home page brand slider + about page dark theme row
for ($i = 16; $i <= 30; $i++) {
    $entries[] = [
        'name' => 'Brand Logo ' . $i,
        'image' => sprintf('assets/images/brand/Logos-%02d.png', $i),
        'sort_order' => $i,
        'show_on_home' => true,
    ];
}

return $entries;
