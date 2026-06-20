<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('service_items', function (Blueprint $table) {
            $table->string('detail_hero_title')->nullable()->after('page_path');
            $table->text('detail_hero_description')->nullable()->after('detail_hero_title');
            $table->foreignId('hero_image_id')->nullable()->after('detail_hero_description')->constrained('media')->nullOnDelete();
            $table->string('process_title')->nullable()->after('highlights');
            $table->string('process_subtitle')->nullable()->after('process_title');
            $table->json('process_steps')->nullable()->after('process_subtitle');
        });
    }

    public function down(): void
    {
        Schema::table('service_items', function (Blueprint $table) {
            $table->dropForeign(['hero_image_id']);
            $table->dropColumn([
                'detail_hero_title',
                'detail_hero_description',
                'hero_image_id',
                'process_title',
                'process_subtitle',
                'process_steps',
            ]);
        });
    }
};
