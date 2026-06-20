<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class ServiceItem extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'service_category_id',
        'title',
        'slug',
        'icon_id',
        'page_path',
        'detail_hero_title',
        'detail_hero_description',
        'hero_image_id',
        'highlights',
        'process_title',
        'process_subtitle',
        'process_steps',
        'domain_extensions',
        'sort_order',
        'is_active',
        'show_on_home',
    ];

    protected function casts(): array
    {
        return [
            'service_category_id' => 'integer',
            'icon_id' => 'integer',
            'hero_image_id' => 'integer',
            'highlights' => 'array',
            'process_steps' => 'array',
            'domain_extensions' => 'array',
            'sort_order' => 'integer',
            'is_active' => 'boolean',
            'show_on_home' => 'boolean',
            'deleted_at' => 'datetime',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(ServiceCategory::class, 'service_category_id');
    }

    public function icon(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'icon_id');
    }

    public function heroImage(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'hero_image_id');
    }
}
