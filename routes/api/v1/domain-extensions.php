<?php

use App\Http\Controllers\Api\DomainExtensionController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/', [DomainExtensionController::class, 'index'])->middleware('permission:view domain extensions');
    Route::post('/', [DomainExtensionController::class, 'store'])->middleware('permission:create domain extensions');
    Route::get('/trashed/list', [DomainExtensionController::class, 'trashed'])->middleware('permission:view domain extensions');
    Route::delete('/bulk/delete', [DomainExtensionController::class, 'bulkDelete'])->middleware('permission:delete domain extensions');
    Route::post('/bulk/restore', [DomainExtensionController::class, 'bulkRestore'])->middleware('permission:edit domain extensions');
    Route::delete('/bulk/force-delete', [DomainExtensionController::class, 'bulkForceDelete'])->middleware('permission:delete domain extensions');
    Route::get('/{id}', [DomainExtensionController::class, 'show'])->middleware('permission:view domain extensions');
    Route::patch('/{id}', [DomainExtensionController::class, 'update'])->middleware('permission:edit domain extensions');
    Route::delete('/{id}', [DomainExtensionController::class, 'destroy'])->middleware('permission:delete domain extensions');
    Route::post('/{id}/restore', [DomainExtensionController::class, 'restore'])->middleware('permission:edit domain extensions');
    Route::delete('/{id}/force', [DomainExtensionController::class, 'forceDestroy'])->middleware('permission:delete domain extensions');
});
