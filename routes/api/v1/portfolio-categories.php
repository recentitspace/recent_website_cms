<?php

use App\Http\Controllers\Api\PortfolioCategoryController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/', [PortfolioCategoryController::class, 'index'])->middleware('permission:view portfolio categories');
    Route::post('/', [PortfolioCategoryController::class, 'store'])->middleware('permission:create portfolio categories');
    Route::get('/trashed/list', [PortfolioCategoryController::class, 'trashed'])->middleware('permission:view portfolio categories');
    Route::delete('/bulk/delete', [PortfolioCategoryController::class, 'bulkDelete'])->middleware('permission:delete portfolio categories');
    Route::post('/bulk/restore', [PortfolioCategoryController::class, 'bulkRestore'])->middleware('permission:edit portfolio categories');
    Route::delete('/bulk/force-delete', [PortfolioCategoryController::class, 'bulkForceDelete'])->middleware('permission:delete portfolio categories');
    Route::get('/{id}', [PortfolioCategoryController::class, 'show'])->middleware('permission:view portfolio categories');
    Route::patch('/{id}', [PortfolioCategoryController::class, 'update'])->middleware('permission:edit portfolio categories');
    Route::delete('/{id}', [PortfolioCategoryController::class, 'destroy'])->middleware('permission:delete portfolio categories');
    Route::post('/{id}/restore', [PortfolioCategoryController::class, 'restore'])->middleware('permission:edit portfolio categories');
    Route::delete('/{id}/force', [PortfolioCategoryController::class, 'forceDestroy'])->middleware('permission:delete portfolio categories');
});
