<?php

use App\Http\Controllers\Api\PricingSectionController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/', [PricingSectionController::class, 'index'])->middleware('permission:view pricing sections');
    Route::post('/', [PricingSectionController::class, 'store'])->middleware('permission:create pricing sections');
    Route::get('/trashed/list', [PricingSectionController::class, 'trashed'])->middleware('permission:view pricing sections');
    Route::delete('/bulk/delete', [PricingSectionController::class, 'bulkDelete'])->middleware('permission:delete pricing sections');
    Route::post('/bulk/restore', [PricingSectionController::class, 'bulkRestore'])->middleware('permission:edit pricing sections');
    Route::delete('/bulk/force-delete', [PricingSectionController::class, 'bulkForceDelete'])->middleware('permission:delete pricing sections');
    Route::get('/{id}', [PricingSectionController::class, 'show'])->middleware('permission:view pricing sections');
    Route::patch('/{id}', [PricingSectionController::class, 'update'])->middleware('permission:edit pricing sections');
    Route::delete('/{id}', [PricingSectionController::class, 'destroy'])->middleware('permission:delete pricing sections');
    Route::post('/{id}/restore', [PricingSectionController::class, 'restore'])->middleware('permission:edit pricing sections');
    Route::delete('/{id}/force', [PricingSectionController::class, 'forceDestroy'])->middleware('permission:delete pricing sections');
});
