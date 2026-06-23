<?php

use App\Http\Controllers\Api\Public\PublicHomeContentController;
use App\Http\Controllers\Api\Public\PublicMiscController;
use App\Http\Controllers\Api\Public\PublicPageBlockController;
use App\Http\Controllers\Api\Public\PublicPortfolioController;
use App\Http\Controllers\Api\Public\PublicPricingController;
use App\Http\Controllers\Api\Public\PublicServiceController;
use App\Http\Controllers\Api\Public\PublicSiteController;
use Illuminate\Support\Facades\Route;

Route::get('/site-settings', [PublicSiteController::class, 'settings']);
Route::get('/social-links', [PublicSiteController::class, 'socialLinks']);

Route::get('/page-blocks', [PublicPageBlockController::class, 'index']);
Route::get('/page-blocks/{key}', [PublicPageBlockController::class, 'show']);

Route::get('/stat-counters', [PublicHomeContentController::class, 'statCounters']);
Route::get('/clients', [PublicHomeContentController::class, 'clients']);
Route::get('/testimonials', [PublicHomeContentController::class, 'testimonials']);
Route::get('/why-choose-items', [PublicHomeContentController::class, 'whyChooseItems']);
Route::get('/about-drive-items', [PublicHomeContentController::class, 'aboutDriveItems']);
Route::get('/about-objectives', [PublicHomeContentController::class, 'aboutObjectives']);

Route::get('/portfolio-categories', [PublicPortfolioController::class, 'categories']);
Route::get('/portfolio-categories/{slug}', [PublicPortfolioController::class, 'showCategory']);
Route::get('/portfolio-items', [PublicPortfolioController::class, 'items']);
Route::get('/portfolio-items/{slug}', [PublicPortfolioController::class, 'showItem']);

Route::get('/pricing-sections', [PublicPricingController::class, 'sections']);
Route::get('/pricing-sections/{slug}', [PublicPricingController::class, 'showSection']);

Route::get('/service-categories', [PublicServiceController::class, 'categories']);
Route::get('/service-categories/{slug}', [PublicServiceController::class, 'showCategory']);
Route::get('/service-items/{slug}', [PublicServiceController::class, 'showItem']);

Route::get('/faqs', [PublicMiscController::class, 'faqs']);
Route::get('/domain-extensions', [PublicMiscController::class, 'domainExtensions']);
Route::get('/blogs', [PublicMiscController::class, 'blogs']);
Route::get('/blogs/{slug}', [PublicMiscController::class, 'showBlog']);
