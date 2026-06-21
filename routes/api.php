<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/ping', function () {
    return response()->json([
        'message' => 'API is working ✅',
        'time' => now(),
    ]);
});

// API Version 1 Routes
Route::prefix('v1')->group(function () {
    // Auth routes
    Route::prefix('auth')->group(base_path('routes/api/v1/auth.php'));

    // Settings routes
    Route::prefix('settings')->group(base_path('routes/api/v1/settings.php'));

    // Users routes
    Route::prefix('users')->group(base_path('routes/api/v1/users.php'));

    // Roles routes
    Route::prefix('roles')->group(base_path('routes/api/v1/roles.php'));

    // Logs routes
    Route::prefix('logs')->group(base_path('routes/api/v1/logs.php'));

    // Organizations routes
    Route::prefix('organizations')->group(base_path('routes/api/v1/organizations.php'));

    // Media routes
    Route::prefix('media')->group(base_path('routes/api/v1/media.php'));

    // Site settings routes
    Route::prefix('site-settings')->group(base_path('routes/api/v1/site-settings.php'));

    // Social links routes
    Route::prefix('social-links')->group(base_path('routes/api/v1/social-links.php'));

    // Portfolio routes
    Route::prefix('portfolio-categories')->group(base_path('routes/api/v1/portfolio-categories.php'));
    Route::prefix('portfolio-items')->group(base_path('routes/api/v1/portfolio-items.php'));
    Route::prefix('clients')->group(base_path('routes/api/v1/clients.php'));
    Route::prefix('testimonials')->group(base_path('routes/api/v1/testimonials.php'));
    Route::prefix('pricing-sections')->group(base_path('routes/api/v1/pricing-sections.php'));
    Route::prefix('pricing-plans')->group(base_path('routes/api/v1/pricing-plans.php'));
    Route::prefix('domain-extensions')->group(base_path('routes/api/v1/domain-extensions.php'));
    Route::prefix('service-categories')->group(base_path('routes/api/v1/service-categories.php'));
    Route::prefix('service-items')->group(base_path('routes/api/v1/service-items.php'));
    Route::prefix('faqs')->group(base_path('routes/api/v1/faqs.php'));
    Route::prefix('stat-counters')->group(base_path('routes/api/v1/stat-counters.php'));
    Route::prefix('page-blocks')->group(base_path('routes/api/v1/page-blocks.php'));
    Route::prefix('why-choose-items')->group(base_path('routes/api/v1/why-choose-items.php'));
    Route::prefix('about-drive-items')->group(base_path('routes/api/v1/about-drive-items.php'));
    Route::prefix('about-objectives')->group(base_path('routes/api/v1/about-objectives.php'));

    // Profile routes
    Route::middleware('auth:sanctum')->put('/auth/profile', [\App\Http\Controllers\Api\AuthController::class, 'updateProfile']);
    Route::middleware('auth:sanctum')->post('/auth/profile-picture', [\App\Http\Controllers\Api\AuthController::class, 'updateProfilePicture']);
    Route::middleware('auth:sanctum')->post('/auth/change-password', [\App\Http\Controllers\Api\AuthController::class, 'changePassword']);
});
