<?php

use App\Http\Controllers\Api\SiteSettingController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/', [SiteSettingController::class, 'show'])->middleware('permission:manage site settings');
    Route::put('/', [SiteSettingController::class, 'update'])->middleware('permission:manage site settings');
});
