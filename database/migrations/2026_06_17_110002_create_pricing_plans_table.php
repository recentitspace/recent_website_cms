<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pricing_plans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pricing_section_id')->constrained('pricing_sections')->cascadeOnDelete();
            $table->string('name');
            $table->string('price');
            $table->string('price_period')->nullable();
            $table->string('style')->default('standard');
            $table->string('cta_text')->default('Get Now');
            $table->string('cta_url')->nullable();
            $table->json('features')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pricing_plans');
    }
};
