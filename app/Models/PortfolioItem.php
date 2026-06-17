<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class PortfolioItem extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'portfolio_category_id',
        'title',
        'slug',
        'tags',
        'type',
        'thumbnail_id',
        'external_link',
        'youtube_url',
        'featured',
        'sort_order',
        'is_published',
        'show_on_home',
        'home_sort_order',
    ];

    protected function casts(): array
    {
        return [
            'portfolio_category_id' => 'integer',
            'thumbnail_id' => 'integer',
            'featured' => 'boolean',
            'sort_order' => 'integer',
            'is_published' => 'boolean',
            'show_on_home' => 'boolean',
            'home_sort_order' => 'integer',
            'deleted_at' => 'datetime',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(PortfolioCategory::class, 'portfolio_category_id');
    }

    public function thumbnail(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'thumbnail_id');
    }

    public function galleryImages(): HasMany
    {
        return $this->hasMany(PortfolioItemImage::class)->orderBy('sort_order');
    }
}
