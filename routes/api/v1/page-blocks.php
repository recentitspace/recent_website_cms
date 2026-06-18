<?php

use App\Http\Controllers\Api\PageBlockController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/', [PageBlockController::class, 'index'])->middleware('permission:view page blocks');
    Route::post('/', [PageBlockController::class, 'store'])->middleware('permission:create page blocks');
    Route::get('/trashed/list', [PageBlockController::class, 'trashed'])->middleware('permission:view page blocks');
    Route::delete('/bulk/delete', [PageBlockController::class, 'bulkDelete'])->middleware('permission:delete page blocks');
    Route::post('/bulk/restore', [PageBlockController::class, 'bulkRestore'])->middleware('permission:edit page blocks');
    Route::delete('/bulk/force-delete', [PageBlockController::class, 'bulkForceDelete'])->middleware('permission:delete page blocks');
    Route::get('/{id}', [PageBlockController::class, 'show'])->middleware('permission:view page blocks');
    Route::patch('/{id}', [PageBlockController::class, 'update'])->middleware('permission:edit page blocks');
    Route::delete('/{id}', [PageBlockController::class, 'destroy'])->middleware('permission:delete page blocks');
    Route::post('/{id}/restore', [PageBlockController::class, 'restore'])->middleware('permission:edit page blocks');
    Route::delete('/{id}/force', [PageBlockController::class, 'forceDestroy'])->middleware('permission:delete page blocks');
});
