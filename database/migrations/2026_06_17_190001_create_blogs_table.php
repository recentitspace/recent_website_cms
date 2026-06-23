<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('blogs', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('excerpt')->nullable();
            $table->json('body_paragraphs')->nullable();
            $table->string('author_name')->nullable();
            $table->foreignId('featured_image_id')->nullable()->constrained('media')->nullOnDelete();
            $table->timestamp('published_at')->nullable();
            $table->string('external_link', 500)->nullable();
            $table->json('tags')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->unsignedInteger('home_sort_order')->nullable();
            $table->boolean('is_active')->default(true);
            $table->boolean('show_on_home')->default(false);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('blogs');
    }
};
