<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('portfolio_items', function (Blueprint $table) {
            $table->boolean('show_on_home')->default(false)->after('is_published');
            $table->unsignedInteger('home_sort_order')->nullable()->after('show_on_home');
        });

        Schema::create('portfolio_item_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('portfolio_item_id')->constrained('portfolio_items')->cascadeOnDelete();
            $table->foreignId('media_id')->constrained('media')->cascadeOnDelete();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->unique(['portfolio_item_id', 'media_id']);
            $table->index(['portfolio_item_id', 'sort_order'], 'portfolio_item_images_item_sort_idx');
        });

        // Data migration: move existing case study galleries onto portfolio items (if tables exist)
        if (Schema::hasTable('case_studies') && Schema::hasTable('case_study_images')) {
            DB::table('case_study_images')
                ->join('case_studies', 'case_study_images.case_study_id', '=', 'case_studies.id')
                ->select([
                    'case_studies.portfolio_item_id as portfolio_item_id',
                    'case_study_images.media_id as media_id',
                    'case_study_images.sort_order as sort_order',
                ])
                ->orderBy('case_studies.portfolio_item_id')
                ->orderBy('case_study_images.sort_order')
                ->get()
                ->each(function ($row) {
                    DB::table('portfolio_item_images')->updateOrInsert(
                        [
                            'portfolio_item_id' => $row->portfolio_item_id,
                            'media_id' => $row->media_id,
                        ],
                        [
                            'sort_order' => $row->sort_order,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]
                    );
                });

            Schema::dropIfExists('case_study_images');
            Schema::dropIfExists('case_studies');
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('portfolio_item_images');

        Schema::table('portfolio_items', function (Blueprint $table) {
            $table->dropColumn(['show_on_home', 'home_sort_order']);
        });

        // We intentionally do not recreate case study tables on rollback.
    }
};

