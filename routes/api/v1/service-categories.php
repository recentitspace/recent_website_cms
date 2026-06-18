<?php

use App\Http\Controllers\Api\ServiceCategoryController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/', [ServiceCategoryController::class, 'index'])->middleware('permission:view service categories');
    Route::post('/', [ServiceCategoryController::class, 'store'])->middleware('permission:create service categories');
    Route::get('/trashed/list', [ServiceCategoryController::class, 'trashed'])->middleware('permission:view service categories');
    Route::delete('/bulk/delete', [ServiceCategoryController::class, 'bulkDelete'])->middleware('permission:delete service categories');
    Route::post('/bulk/restore', [ServiceCategoryController::class, 'bulkRestore'])->middleware('permission:edit service categories');
    Route::delete('/bulk/force-delete', [ServiceCategoryController::class, 'bulkForceDelete'])->middleware('permission:delete service categories');
    Route::get('/{id}', [ServiceCategoryController::class, 'show'])->middleware('permission:view service categories');
    Route::patch('/{id}', [ServiceCategoryController::class, 'update'])->middleware('permission:edit service categories');
    Route::delete('/{id}', [ServiceCategoryController::class, 'destroy'])->middleware('permission:delete service categories');
    Route::post('/{id}/restore', [ServiceCategoryController::class, 'restore'])->middleware('permission:edit service categories');
    Route::delete('/{id}/force', [ServiceCategoryController::class, 'forceDestroy'])->middleware('permission:delete service categories');
});
