<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('why_choose_items', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('body')->nullable();
            $table->foreignId('icon_id')->nullable()->constrained('media')->nullOnDelete();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();

            $table->index('sort_order');
        });

        Schema::create('about_drive_items', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('body')->nullable();
            $table->foreignId('image_id')->nullable()->constrained('media')->nullOnDelete();
            $table->json('bullets')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();

            $table->index('sort_order');
        });

        Schema::create('about_objectives', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('body')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();

            $table->index('sort_order');
        });

        if (Schema::hasTable('page_block_items')) {
            $this->migrateFromPageBlockItems();
            Schema::dropIfExists('page_block_items');
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('about_objectives');
        Schema::dropIfExists('about_drive_items');
        Schema::dropIfExists('why_choose_items');

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

    private function migrateFromPageBlockItems(): void
    {
        $blockKeyMap = DB::table('page_blocks')->pluck('key', 'id');

        $rows = DB::table('page_block_items')->orderBy('id')->get();

        foreach ($rows as $row) {
            $key = $blockKeyMap[$row->page_block_id] ?? null;

            if ($key === 'home_why_choose') {
                DB::table('why_choose_items')->insert([
                    'title' => $row->title,
                    'body' => $row->body,
                    'icon_id' => $row->icon_id,
                    'sort_order' => $row->sort_order,
                    'is_active' => $row->is_active,
                    'created_at' => $row->created_at,
                    'updated_at' => $row->updated_at,
                    'deleted_at' => $row->deleted_at,
                ]);
                continue;
            }

            if ($key === 'about_what_drives_us') {
                DB::table('about_drive_items')->insert([
                    'title' => $row->title,
                    'body' => $row->body,
                    'image_id' => $row->image_id,
                    'bullets' => $row->bullets,
                    'sort_order' => $row->sort_order,
                    'is_active' => $row->is_active,
                    'created_at' => $row->created_at,
                    'updated_at' => $row->updated_at,
                    'deleted_at' => $row->deleted_at,
                ]);
                continue;
            }

            if ($key === 'about_objectives') {
                DB::table('about_objectives')->insert([
                    'title' => $row->title,
                    'body' => $row->body,
                    'sort_order' => $row->sort_order,
                    'is_active' => $row->is_active,
                    'created_at' => $row->created_at,
                    'updated_at' => $row->updated_at,
                    'deleted_at' => $row->deleted_at,
                ]);
            }
        }
    }
};
