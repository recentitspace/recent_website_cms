<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('service_categories', function (Blueprint $table) {
            $table->string('process_title')->nullable()->after('cta_text');
            $table->string('process_subtitle')->nullable()->after('process_title');
            $table->json('process_steps')->nullable()->after('process_subtitle');
        });
    }

    public function down(): void
    {
        Schema::table('service_categories', function (Blueprint $table) {
            $table->dropColumn(['process_title', 'process_subtitle', 'process_steps']);
        });
    }
};
