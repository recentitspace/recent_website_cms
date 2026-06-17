<?php

use App\Http\Controllers\Api\ClientController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/', [ClientController::class, 'index'])->middleware('permission:view clients');
    Route::post('/', [ClientController::class, 'store'])->middleware('permission:create clients');
    Route::get('/trashed/list', [ClientController::class, 'trashed'])->middleware('permission:view clients');
    Route::delete('/bulk/delete', [ClientController::class, 'bulkDelete'])->middleware('permission:delete clients');
    Route::post('/bulk/restore', [ClientController::class, 'bulkRestore'])->middleware('permission:edit clients');
    Route::delete('/bulk/force-delete', [ClientController::class, 'bulkForceDelete'])->middleware('permission:delete clients');
    Route::get('/{id}', [ClientController::class, 'show'])->middleware('permission:view clients');
    Route::patch('/{id}', [ClientController::class, 'update'])->middleware('permission:edit clients');
    Route::delete('/{id}', [ClientController::class, 'destroy'])->middleware('permission:delete clients');
    Route::post('/{id}/restore', [ClientController::class, 'restore'])->middleware('permission:edit clients');
    Route::delete('/{id}/force', [ClientController::class, 'forceDestroy'])->middleware('permission:delete clients');
});
