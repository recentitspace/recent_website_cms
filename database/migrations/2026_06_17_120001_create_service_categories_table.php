<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('service_categories', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->foreignId('icon_id')->nullable()->constrained('media')->nullOnDelete();
            $table->foreignId('hero_image_id')->nullable()->constrained('media')->nullOnDelete();
            $table->string('hero_title')->nullable();
            $table->text('description')->nullable();
            $table->string('listing_subtitle')->nullable();
            $table->string('page_path');
            $table->string('cta_text')->default('Get started');
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->boolean('show_on_home')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('service_categories');
    }
};
