<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class PricingSection extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'title',
        'slug',
        'tab_label',
        'subtitle',
        'sort_order',
        'is_active',
        'show_on_home',
    ];

    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
            'is_active' => 'boolean',
            'show_on_home' => 'boolean',
            'deleted_at' => 'datetime',
        ];
    }

    public function plans(): HasMany
    {
        return $this->hasMany(PricingPlan::class)->orderBy('sort_order');
    }
}
