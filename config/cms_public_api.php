<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Public website API key
    |--------------------------------------------------------------------------
    |
    | Shared secret used by the R-web frontend to read published content.
    | Send via X-Public-Api-Key header or Authorization: Bearer {key}.
    |
    */
    'api_key' => env('PUBLIC_API_KEY'),
];
