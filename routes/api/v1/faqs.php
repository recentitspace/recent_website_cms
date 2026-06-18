<?php

use App\Http\Controllers\Api\FaqController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/', [FaqController::class, 'index'])->middleware('permission:view faqs');
    Route::post('/', [FaqController::class, 'store'])->middleware('permission:create faqs');
    Route::get('/trashed/list', [FaqController::class, 'trashed'])->middleware('permission:view faqs');
    Route::delete('/bulk/delete', [FaqController::class, 'bulkDelete'])->middleware('permission:delete faqs');
    Route::post('/bulk/restore', [FaqController::class, 'bulkRestore'])->middleware('permission:edit faqs');
    Route::delete('/bulk/force-delete', [FaqController::class, 'bulkForceDelete'])->middleware('permission:delete faqs');
    Route::get('/{id}', [FaqController::class, 'show'])->middleware('permission:view faqs');
    Route::patch('/{id}', [FaqController::class, 'update'])->middleware('permission:edit faqs');
    Route::delete('/{id}', [FaqController::class, 'destroy'])->middleware('permission:delete faqs');
    Route::post('/{id}/restore', [FaqController::class, 'restore'])->middleware('permission:edit faqs');
    Route::delete('/{id}/force', [FaqController::class, 'forceDestroy'])->middleware('permission:delete faqs');
});
