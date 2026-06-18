<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class PageBlock extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'page',
        'key',
        'title',
        'subtitle',
        'body',
        'image_id',
        'cta_text',
        'cta_url',
        'cta_secondary_text',
        'cta_secondary_url',
        'video_url',
        'sort_order',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'image_id' => 'integer',
            'sort_order' => 'integer',
            'is_active' => 'boolean',
            'deleted_at' => 'datetime',
        ];
    }

    public function image(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'image_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(PageBlockItem::class)->orderBy('sort_order');
    }
}
