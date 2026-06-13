<?php

use App\Http\Controllers\Api\PublicServiceController;
use App\Http\Controllers\Api\ServiceController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Services API Routes
|--------------------------------------------------------------------------
|
| Public read endpoints for the Recent-IT website consumer.
| Authenticated manage endpoints for the CMS admin UI.
|
*/

// Public endpoints (published records only)
Route::get('/navigation', [PublicServiceController::class, 'navigation']);
Route::get('/categories/{slug}', [PublicServiceController::class, 'category']);
Route::get('/{categorySlug}/{serviceSlug}', [PublicServiceController::class, 'show']);
Route::get('/', [PublicServiceController::class, 'index']);

// Admin endpoints
Route::middleware('auth:sanctum')->prefix('manage')->group(function () {
    Route::get('/tree', [ServiceController::class, 'tree'])->middleware('permission:view services');
    Route::get('/reference-options', [ServiceController::class, 'referenceOptions'])->middleware('permission:view services');
    Route::post('/reorder', [ServiceController::class, 'reorder'])->middleware('permission:edit services');

    Route::get('/', [ServiceController::class, 'index'])->middleware('permission:view services');
    Route::post('/', [ServiceController::class, 'store'])->middleware('permission:create services');
    Route::get('/{id}', [ServiceController::class, 'show'])->middleware('permission:view services');
    Route::patch('/{id}', [ServiceController::class, 'update'])->middleware('permission:edit services');
    Route::delete('/{id}', [ServiceController::class, 'destroy'])->middleware('permission:delete services');

    Route::post('/{id}/upload-icon', [ServiceController::class, 'uploadIcon'])->middleware('permission:edit services');
    Route::post('/{id}/upload-hero-image', [ServiceController::class, 'uploadHeroImage'])->middleware('permission:edit services');
});
