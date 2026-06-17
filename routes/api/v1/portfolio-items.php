<?php

use App\Http\Controllers\Api\PortfolioItemController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/', [PortfolioItemController::class, 'index'])->middleware('permission:view portfolio items');
    Route::post('/', [PortfolioItemController::class, 'store'])->middleware('permission:create portfolio items');
    Route::get('/trashed/list', [PortfolioItemController::class, 'trashed'])->middleware('permission:view portfolio items');
    Route::delete('/bulk/delete', [PortfolioItemController::class, 'bulkDelete'])->middleware('permission:delete portfolio items');
    Route::post('/bulk/restore', [PortfolioItemController::class, 'bulkRestore'])->middleware('permission:edit portfolio items');
    Route::delete('/bulk/force-delete', [PortfolioItemController::class, 'bulkForceDelete'])->middleware('permission:delete portfolio items');
    Route::get('/{id}', [PortfolioItemController::class, 'show'])->middleware('permission:view portfolio items');
    Route::patch('/{id}', [PortfolioItemController::class, 'update'])->middleware('permission:edit portfolio items');
    Route::delete('/{id}', [PortfolioItemController::class, 'destroy'])->middleware('permission:delete portfolio items');
    Route::post('/{id}/restore', [PortfolioItemController::class, 'restore'])->middleware('permission:edit portfolio items');
    Route::delete('/{id}/force', [PortfolioItemController::class, 'forceDestroy'])->middleware('permission:delete portfolio items');
});
