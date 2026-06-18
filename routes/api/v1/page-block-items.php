<?php

use App\Http\Controllers\Api\PageBlockItemController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/', [PageBlockItemController::class, 'index'])->middleware('permission:view page block items');
    Route::post('/', [PageBlockItemController::class, 'store'])->middleware('permission:create page block items');
    Route::get('/trashed/list', [PageBlockItemController::class, 'trashed'])->middleware('permission:view page block items');
    Route::delete('/bulk/delete', [PageBlockItemController::class, 'bulkDelete'])->middleware('permission:delete page block items');
    Route::post('/bulk/restore', [PageBlockItemController::class, 'bulkRestore'])->middleware('permission:edit page block items');
    Route::delete('/bulk/force-delete', [PageBlockItemController::class, 'bulkForceDelete'])->middleware('permission:delete page block items');
    Route::get('/{id}', [PageBlockItemController::class, 'show'])->middleware('permission:view page block items');
    Route::patch('/{id}', [PageBlockItemController::class, 'update'])->middleware('permission:edit page block items');
    Route::delete('/{id}', [PageBlockItemController::class, 'destroy'])->middleware('permission:delete page block items');
    Route::post('/{id}/restore', [PageBlockItemController::class, 'restore'])->middleware('permission:edit page block items');
    Route::delete('/{id}/force', [PageBlockItemController::class, 'forceDestroy'])->middleware('permission:delete page block items');
});
