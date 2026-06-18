<?php

use App\Http\Controllers\Api\PricingPlanController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/', [PricingPlanController::class, 'index'])->middleware('permission:view pricing plans');
    Route::post('/', [PricingPlanController::class, 'store'])->middleware('permission:create pricing plans');
    Route::get('/trashed/list', [PricingPlanController::class, 'trashed'])->middleware('permission:view pricing plans');
    Route::delete('/bulk/delete', [PricingPlanController::class, 'bulkDelete'])->middleware('permission:delete pricing plans');
    Route::post('/bulk/restore', [PricingPlanController::class, 'bulkRestore'])->middleware('permission:edit pricing plans');
    Route::delete('/bulk/force-delete', [PricingPlanController::class, 'bulkForceDelete'])->middleware('permission:delete pricing plans');
    Route::get('/{id}', [PricingPlanController::class, 'show'])->middleware('permission:view pricing plans');
    Route::patch('/{id}', [PricingPlanController::class, 'update'])->middleware('permission:edit pricing plans');
    Route::delete('/{id}', [PricingPlanController::class, 'destroy'])->middleware('permission:delete pricing plans');
    Route::post('/{id}/restore', [PricingPlanController::class, 'restore'])->middleware('permission:edit pricing plans');
    Route::delete('/{id}/force', [PricingPlanController::class, 'forceDestroy'])->middleware('permission:delete pricing plans');
});
