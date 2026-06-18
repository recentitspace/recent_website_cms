<?php

use App\Http\Controllers\Api\StatCounterController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/', [StatCounterController::class, 'index'])->middleware('permission:view stat counters');
    Route::post('/', [StatCounterController::class, 'store'])->middleware('permission:create stat counters');
    Route::get('/trashed/list', [StatCounterController::class, 'trashed'])->middleware('permission:view stat counters');
    Route::delete('/bulk/delete', [StatCounterController::class, 'bulkDelete'])->middleware('permission:delete stat counters');
    Route::post('/bulk/restore', [StatCounterController::class, 'bulkRestore'])->middleware('permission:edit stat counters');
    Route::delete('/bulk/force-delete', [StatCounterController::class, 'bulkForceDelete'])->middleware('permission:delete stat counters');
    Route::get('/{id}', [StatCounterController::class, 'show'])->middleware('permission:view stat counters');
    Route::patch('/{id}', [StatCounterController::class, 'update'])->middleware('permission:edit stat counters');
    Route::delete('/{id}', [StatCounterController::class, 'destroy'])->middleware('permission:delete stat counters');
    Route::post('/{id}/restore', [StatCounterController::class, 'restore'])->middleware('permission:edit stat counters');
    Route::delete('/{id}/force', [StatCounterController::class, 'forceDestroy'])->middleware('permission:delete stat counters');
});
