<?php

use App\Http\Controllers\Api\ServiceItemController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/', [ServiceItemController::class, 'index'])->middleware('permission:view service items');
    Route::post('/', [ServiceItemController::class, 'store'])->middleware('permission:create service items');
    Route::get('/trashed/list', [ServiceItemController::class, 'trashed'])->middleware('permission:view service items');
    Route::delete('/bulk/delete', [ServiceItemController::class, 'bulkDelete'])->middleware('permission:delete service items');
    Route::post('/bulk/restore', [ServiceItemController::class, 'bulkRestore'])->middleware('permission:edit service items');
    Route::delete('/bulk/force-delete', [ServiceItemController::class, 'bulkForceDelete'])->middleware('permission:delete service items');
    Route::get('/{id}', [ServiceItemController::class, 'show'])->middleware('permission:view service items');
    Route::patch('/{id}', [ServiceItemController::class, 'update'])->middleware('permission:edit service items');
    Route::delete('/{id}', [ServiceItemController::class, 'destroy'])->middleware('permission:delete service items');
    Route::post('/{id}/restore', [ServiceItemController::class, 'restore'])->middleware('permission:edit service items');
    Route::delete('/{id}/force', [ServiceItemController::class, 'forceDestroy'])->middleware('permission:delete service items');
});
