<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Client extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'logo_id',
        'url',
        'sort_order',
        'is_active',
        'show_on_home',
    ];

    protected function casts(): array
    {
        return [
            'logo_id' => 'integer',
            'sort_order' => 'integer',
            'is_active' => 'boolean',
            'show_on_home' => 'boolean',
            'deleted_at' => 'datetime',
        ];
    }

    public function logo(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'logo_id');
    }
}
