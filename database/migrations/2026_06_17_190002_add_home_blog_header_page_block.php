<?php

use App\Models\PageBlock;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        PageBlock::updateOrCreate(
            ['key' => 'home_blog_header'],
            [
                'page' => 'home',
                'title' => 'blogs',
                'subtitle' => 'Recent articles from blog',
                'is_active' => true,
            ]
        );
    }

    public function down(): void
    {
        PageBlock::where('key', 'home_blog_header')->delete();
    }
};
