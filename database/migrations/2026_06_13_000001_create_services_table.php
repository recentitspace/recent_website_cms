<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('parent_id')->nullable();
            $table->string('type', 20);
            $table->string('slug', 100);
            $table->string('name');
            $table->string('short_name', 100)->nullable();
            $table->string('icon', 500)->nullable();
            $table->string('hero_image', 500)->nullable();
            $table->string('banner_title')->nullable();
            $table->text('banner_subtitle')->nullable();
            $table->string('hero_title')->nullable();
            $table->string('hero_title_highlight', 100)->nullable();
            $table->text('hero_description')->nullable();
            $table->string('section_title')->nullable();
            $table->text('section_subtitle')->nullable();
            $table->string('cta_text', 100)->nullable();
            $table->string('cta_url', 500)->nullable();
            $table->string('portfolio_category', 100)->nullable();
            $table->string('pricing_category_slug', 100)->nullable();
            $table->boolean('show_in_nav')->default(true);
            $table->boolean('show_on_homepage')->default(true);
            $table->integer('sort_order')->default(0);
            $table->string('status', 20)->default('published');
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->timestamps();

            $table->unique(['parent_id', 'slug']);
            $table->index(['type', 'status', 'sort_order']);
            $table->index(['show_in_nav', 'status']);
            $table->index(['show_on_homepage', 'status']);
        });

        Schema::table('services', function (Blueprint $table) {
            $table->foreign('parent_id')->references('id')->on('services')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};
