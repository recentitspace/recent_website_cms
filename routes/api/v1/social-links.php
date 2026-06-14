<?php

use App\Http\Controllers\Api\SocialLinkController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/', [SocialLinkController::class, 'index'])->middleware('permission:view social links');
    Route::post('/', [SocialLinkController::class, 'store'])->middleware('permission:create social links');
    Route::get('/{id}', [SocialLinkController::class, 'show'])->middleware('permission:view social links');
    Route::patch('/{id}', [SocialLinkController::class, 'update'])->middleware('permission:edit social links');
    Route::delete('/bulk/delete', [SocialLinkController::class, 'bulkDelete'])->middleware('permission:delete social links');
    Route::delete('/{id}', [SocialLinkController::class, 'destroy'])->middleware('permission:delete social links');
});
