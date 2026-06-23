<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pricing_sections', function (Blueprint $table) {
            $table->string('tab_label')->nullable()->after('title');
        });
    }

    public function down(): void
    {
        Schema::table('pricing_sections', function (Blueprint $table) {
            $table->dropColumn('tab_label');
        });
    }
};
