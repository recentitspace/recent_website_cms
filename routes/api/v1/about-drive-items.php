<?php

use App\Http\Controllers\Api\AboutDriveItemController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/', [AboutDriveItemController::class, 'index'])->middleware('permission:view about drive items');
    Route::post('/', [AboutDriveItemController::class, 'store'])->middleware('permission:create about drive items');
    Route::get('/trashed/list', [AboutDriveItemController::class, 'trashed'])->middleware('permission:view about drive items');
    Route::delete('/bulk/delete', [AboutDriveItemController::class, 'bulkDelete'])->middleware('permission:delete about drive items');
    Route::post('/bulk/restore', [AboutDriveItemController::class, 'bulkRestore'])->middleware('permission:edit about drive items');
    Route::delete('/bulk/force-delete', [AboutDriveItemController::class, 'bulkForceDelete'])->middleware('permission:delete about drive items');
    Route::get('/{id}', [AboutDriveItemController::class, 'show'])->middleware('permission:view about drive items');
    Route::patch('/{id}', [AboutDriveItemController::class, 'update'])->middleware('permission:edit about drive items');
    Route::delete('/{id}', [AboutDriveItemController::class, 'destroy'])->middleware('permission:delete about drive items');
    Route::post('/{id}/restore', [AboutDriveItemController::class, 'restore'])->middleware('permission:edit about drive items');
    Route::delete('/{id}/force', [AboutDriveItemController::class, 'forceDestroy'])->middleware('permission:delete about drive items');
});
