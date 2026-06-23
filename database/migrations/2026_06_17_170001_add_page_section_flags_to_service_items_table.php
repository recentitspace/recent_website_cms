<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('service_items', function (Blueprint $table) {
            $table->boolean('show_featured_portfolio')->default(false)->after('show_on_home');
            $table->string('portfolio_category_slug')->nullable()->after('show_featured_portfolio');
            $table->boolean('show_domain_registration')->default(false)->after('portfolio_category_slug');
        });
    }

    public function down(): void
    {
        Schema::table('service_items', function (Blueprint $table) {
            $table->dropColumn([
                'show_featured_portfolio',
                'portfolio_category_slug',
                'show_domain_registration',
            ]);
        });
    }
};
