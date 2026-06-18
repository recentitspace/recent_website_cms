<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('page_block_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('page_block_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('body')->nullable();
            $table->foreignId('image_id')->nullable()->constrained('media')->nullOnDelete();
            $table->foreignId('icon_id')->nullable()->constrained('media')->nullOnDelete();
            $table->json('bullets')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['page_block_id', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('page_block_items');
    }
};
