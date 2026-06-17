<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PortfolioItemImage extends Model
{
    protected $fillable = [
        'portfolio_item_id',
        'media_id',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'portfolio_item_id' => 'integer',
            'media_id' => 'integer',
            'sort_order' => 'integer',
        ];
    }

    public function portfolioItem(): BelongsTo
    {
        return $this->belongsTo(PortfolioItem::class);
    }

    public function media(): BelongsTo
    {
        return $this->belongsTo(Media::class);
    }
}

