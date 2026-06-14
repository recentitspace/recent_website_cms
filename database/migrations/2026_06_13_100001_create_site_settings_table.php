<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('site_settings', function (Blueprint $table) {
            $table->id();
            $table->string('site_name')->nullable();
            $table->string('tagline')->nullable();
            $table->string('copyright_text')->nullable();
            $table->string('whatsapp_number', 30)->nullable();
            $table->string('whatsapp_label')->nullable();
            $table->string('contact_email')->nullable();
            $table->string('phone', 30)->nullable();
            $table->text('address')->nullable();
            $table->string('notification_email')->nullable();
            $table->foreignId('logo_light_id')->nullable()->constrained('media')->nullOnDelete();
            $table->foreignId('logo_dark_id')->nullable()->constrained('media')->nullOnDelete();
            $table->foreignId('favicon_id')->nullable()->constrained('media')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('site_settings');
    }
};
