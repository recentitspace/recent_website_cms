<?php

use App\Http\Controllers\Api\WhyChooseItemController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/', [WhyChooseItemController::class, 'index'])->middleware('permission:view why choose items');
    Route::post('/', [WhyChooseItemController::class, 'store'])->middleware('permission:create why choose items');
    Route::get('/trashed/list', [WhyChooseItemController::class, 'trashed'])->middleware('permission:view why choose items');
    Route::delete('/bulk/delete', [WhyChooseItemController::class, 'bulkDelete'])->middleware('permission:delete why choose items');
    Route::post('/bulk/restore', [WhyChooseItemController::class, 'bulkRestore'])->middleware('permission:edit why choose items');
    Route::delete('/bulk/force-delete', [WhyChooseItemController::class, 'bulkForceDelete'])->middleware('permission:delete why choose items');
    Route::get('/{id}', [WhyChooseItemController::class, 'show'])->middleware('permission:view why choose items');
    Route::patch('/{id}', [WhyChooseItemController::class, 'update'])->middleware('permission:edit why choose items');
    Route::delete('/{id}', [WhyChooseItemController::class, 'destroy'])->middleware('permission:delete why choose items');
    Route::post('/{id}/restore', [WhyChooseItemController::class, 'restore'])->middleware('permission:edit why choose items');
    Route::delete('/{id}/force', [WhyChooseItemController::class, 'forceDestroy'])->middleware('permission:delete why choose items');
});
