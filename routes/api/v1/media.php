<?php

use App\Http\Controllers\Api\MediaController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Media API Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/', [MediaController::class, 'index'])->middleware('permission:view media');
    Route::post('/', [MediaController::class, 'store'])->middleware('permission:upload media');
    Route::post('/bulk', [MediaController::class, 'bulkStore'])->middleware('permission:upload media');
    Route::get('/{id}', [MediaController::class, 'show'])->middleware('permission:view media');
    Route::patch('/{id}', [MediaController::class, 'update'])->middleware('permission:edit media');
    Route::delete('/bulk/delete', [MediaController::class, 'bulkDelete'])->middleware('permission:delete media');
    Route::delete('/{id}', [MediaController::class, 'destroy'])->middleware('permission:delete media');
});
