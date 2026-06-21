<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class WhyChooseItem extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'title',
        'body',
        'icon_id',
        'sort_order',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'icon_id' => 'integer',
            'sort_order' => 'integer',
            'is_active' => 'boolean',
            'deleted_at' => 'datetime',
        ];
    }

    public function icon(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'icon_id');
    }
}
