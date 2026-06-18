<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('service_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('service_category_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->string('slug');
            $table->foreignId('icon_id')->nullable()->constrained('media')->nullOnDelete();
            $table->string('page_path');
            $table->json('highlights')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->boolean('show_on_home')->default(true);
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['service_category_id', 'slug'], 'service_items_category_slug_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('service_items');
    }
};
