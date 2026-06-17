<?php

use App\Http\Controllers\Api\TestimonialController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/', [TestimonialController::class, 'index'])->middleware('permission:view testimonials');
    Route::post('/', [TestimonialController::class, 'store'])->middleware('permission:create testimonials');
    Route::get('/trashed/list', [TestimonialController::class, 'trashed'])->middleware('permission:view testimonials');
    Route::delete('/bulk/delete', [TestimonialController::class, 'bulkDelete'])->middleware('permission:delete testimonials');
    Route::post('/bulk/restore', [TestimonialController::class, 'bulkRestore'])->middleware('permission:edit testimonials');
    Route::delete('/bulk/force-delete', [TestimonialController::class, 'bulkForceDelete'])->middleware('permission:delete testimonials');
    Route::get('/{id}', [TestimonialController::class, 'show'])->middleware('permission:view testimonials');
    Route::patch('/{id}', [TestimonialController::class, 'update'])->middleware('permission:edit testimonials');
    Route::delete('/{id}', [TestimonialController::class, 'destroy'])->middleware('permission:delete testimonials');
    Route::post('/{id}/restore', [TestimonialController::class, 'restore'])->middleware('permission:edit testimonials');
    Route::delete('/{id}/force', [TestimonialController::class, 'forceDestroy'])->middleware('permission:delete testimonials');
});
