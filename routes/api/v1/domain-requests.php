<?php

use App\Http\Controllers\Api\DomainRequestController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/', [DomainRequestController::class, 'index'])->middleware('permission:view domain requests');
    Route::get('/{id}', [DomainRequestController::class, 'show'])->middleware('permission:view domain requests');
    Route::patch('/{id}', [DomainRequestController::class, 'update'])->middleware('permission:edit domain requests');
    Route::delete('/{id}', [DomainRequestController::class, 'destroy'])->middleware('permission:delete domain requests');
});
