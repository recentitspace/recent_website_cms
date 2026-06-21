<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class AboutDriveItem extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'title',
        'body',
        'image_id',
        'bullets',
        'sort_order',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'image_id' => 'integer',
            'bullets' => 'array',
            'sort_order' => 'integer',
            'is_active' => 'boolean',
            'deleted_at' => 'datetime',
        ];
    }

    public function image(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'image_id');
    }
}
