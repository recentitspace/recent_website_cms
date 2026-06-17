<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('portfolio_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('portfolio_category_id')->constrained('portfolio_categories')->cascadeOnDelete();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('tags')->nullable();
            $table->enum('type', ['image', 'project', 'video'])->default('image');
            $table->foreignId('thumbnail_id')->nullable()->constrained('media')->nullOnDelete();
            $table->string('external_link', 500)->nullable();
            $table->string('youtube_url', 500)->nullable();
            $table->boolean('featured')->default(false);
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_published')->default(true);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['portfolio_category_id', 'is_published', 'featured'], 'portfolio_items_cat_pub_feat_idx');
            $table->index('type');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('portfolio_items');
    }
};
