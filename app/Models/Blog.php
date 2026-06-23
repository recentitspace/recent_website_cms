<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Blog extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'title',
        'slug',
        'excerpt',
        'body_paragraphs',
        'author_name',
        'featured_image_id',
        'published_at',
        'external_link',
        'tags',
        'sort_order',
        'home_sort_order',
        'is_active',
        'show_on_home',
    ];

    protected function casts(): array
    {
        return [
            'body_paragraphs' => 'array',
            'tags' => 'array',
            'featured_image_id' => 'integer',
            'sort_order' => 'integer',
            'home_sort_order' => 'integer',
            'is_active' => 'boolean',
            'show_on_home' => 'boolean',
            'published_at' => 'datetime',
            'deleted_at' => 'datetime',
        ];
    }

    public function featuredImage(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'featured_image_id');
    }
}
