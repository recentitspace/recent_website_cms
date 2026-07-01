<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('domain_requests', function (Blueprint $table) {
            $table->id();
            $table->string('domain_name');
            $table->string('extension', 50);
            $table->string('extension_price', 50);
            $table->string('extension_period', 20)->default('/yr');
            $table->string('email');
            $table->string('phone', 50);
            $table->string('status', 20)->default('pending');
            $table->timestamps();

            $table->index(['domain_name', 'extension']);
            $table->index('email');
            $table->index('phone');
            $table->index('status');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('domain_requests');
    }
};
