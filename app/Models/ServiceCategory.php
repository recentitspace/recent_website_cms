<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class ServiceCategory extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'title',
        'slug',
        'icon_id',
        'hero_image_id',
        'hero_title',
        'description',
        'listing_subtitle',
        'page_path',
        'cta_text',
        'process_title',
        'process_subtitle',
        'process_steps',
        'sort_order',
        'is_active',
        'show_on_home',
    ];

    protected function casts(): array
    {
        return [
            'icon_id' => 'integer',
            'hero_image_id' => 'integer',
            'sort_order' => 'integer',
            'is_active' => 'boolean',
            'show_on_home' => 'boolean',
            'process_steps' => 'array',
            'deleted_at' => 'datetime',
        ];
    }

    public function icon(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'icon_id');
    }

    public function heroImage(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'hero_image_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(ServiceItem::class)->orderBy('sort_order');
    }
}
