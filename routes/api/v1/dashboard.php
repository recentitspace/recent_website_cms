<?php

use App\Http\Controllers\Api\DashboardController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'permission:view dashboard'])->group(function () {
    Route::get('/', [DashboardController::class, 'index']);
});
