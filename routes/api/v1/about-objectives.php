<?php

use App\Http\Controllers\Api\AboutObjectiveController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/', [AboutObjectiveController::class, 'index'])->middleware('permission:view about objectives');
    Route::post('/', [AboutObjectiveController::class, 'store'])->middleware('permission:create about objectives');
    Route::get('/trashed/list', [AboutObjectiveController::class, 'trashed'])->middleware('permission:view about objectives');
    Route::delete('/bulk/delete', [AboutObjectiveController::class, 'bulkDelete'])->middleware('permission:delete about objectives');
    Route::post('/bulk/restore', [AboutObjectiveController::class, 'bulkRestore'])->middleware('permission:edit about objectives');
    Route::delete('/bulk/force-delete', [AboutObjectiveController::class, 'bulkForceDelete'])->middleware('permission:delete about objectives');
    Route::get('/{id}', [AboutObjectiveController::class, 'show'])->middleware('permission:view about objectives');
    Route::patch('/{id}', [AboutObjectiveController::class, 'update'])->middleware('permission:edit about objectives');
    Route::delete('/{id}', [AboutObjectiveController::class, 'destroy'])->middleware('permission:delete about objectives');
    Route::post('/{id}/restore', [AboutObjectiveController::class, 'restore'])->middleware('permission:edit about objectives');
    Route::delete('/{id}/force', [AboutObjectiveController::class, 'forceDestroy'])->middleware('permission:delete about objectives');
});
