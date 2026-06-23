<?php

use App\Http\Controllers\Api\BlogController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/', [BlogController::class, 'index'])->middleware('permission:view blogs');
    Route::post('/', [BlogController::class, 'store'])->middleware('permission:create blogs');
    Route::get('/trashed/list', [BlogController::class, 'trashed'])->middleware('permission:view blogs');
    Route::delete('/bulk/delete', [BlogController::class, 'bulkDelete'])->middleware('permission:delete blogs');
    Route::post('/bulk/restore', [BlogController::class, 'bulkRestore'])->middleware('permission:edit blogs');
    Route::delete('/bulk/force-delete', [BlogController::class, 'bulkForceDelete'])->middleware('permission:delete blogs');
    Route::get('/{id}', [BlogController::class, 'show'])->middleware('permission:view blogs');
    Route::patch('/{id}', [BlogController::class, 'update'])->middleware('permission:edit blogs');
    Route::delete('/{id}', [BlogController::class, 'destroy'])->middleware('permission:delete blogs');
    Route::post('/{id}/restore', [BlogController::class, 'restore'])->middleware('permission:edit blogs');
    Route::delete('/{id}/force', [BlogController::class, 'forceDestroy'])->middleware('permission:delete blogs');
});
