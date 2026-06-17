<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Testimonial extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'quote',
        'author_name',
        'author_role',
        'logo_light_id',
        'logo_dark_id',
        'avatar_id',
        'sort_order',
        'is_active',
        'show_on_home',
    ];

    protected function casts(): array
    {
        return [
            'logo_light_id' => 'integer',
            'logo_dark_id' => 'integer',
            'avatar_id' => 'integer',
            'sort_order' => 'integer',
            'is_active' => 'boolean',
            'show_on_home' => 'boolean',
            'deleted_at' => 'datetime',
        ];
    }

    public function logoLight(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'logo_light_id');
    }

    public function logoDark(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'logo_dark_id');
    }

    public function avatar(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'avatar_id');
    }
}
