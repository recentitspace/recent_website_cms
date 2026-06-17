<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('case_studies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('portfolio_item_id')->unique()->constrained('portfolio_items')->cascadeOnDelete();
            $table->string('slug')->unique();
            $table->string('title');
            $table->string('client_name')->nullable();
            $table->text('description')->nullable();
            $table->text('challenge')->nullable();
            $table->text('solution')->nullable();
            $table->text('results')->nullable();
            $table->string('live_url', 500)->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('case_study_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('case_study_id')->constrained('case_studies')->cascadeOnDelete();
            $table->foreignId('media_id')->constrained('media')->cascadeOnDelete();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->unique(['case_study_id', 'media_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('case_study_images');
        Schema::dropIfExists('case_studies');
    }
};
