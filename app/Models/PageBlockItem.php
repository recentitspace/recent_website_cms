<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class PageBlockItem extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'page_block_id',
        'title',
        'body',
        'image_id',
        'icon_id',
        'bullets',
        'sort_order',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'page_block_id' => 'integer',
            'image_id' => 'integer',
            'icon_id' => 'integer',
            'bullets' => 'array',
            'sort_order' => 'integer',
            'is_active' => 'boolean',
            'deleted_at' => 'datetime',
        ];
    }

    public function block(): BelongsTo
    {
        return $this->belongsTo(PageBlock::class, 'page_block_id');
    }

    public function image(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'image_id');
    }

    public function icon(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'icon_id');
    }
}
