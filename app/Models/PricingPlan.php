<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class PricingPlan extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'pricing_section_id',
        'name',
        'price',
        'price_period',
        'style',
        'cta_text',
        'cta_url',
        'features',
        'sort_order',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'pricing_section_id' => 'integer',
            'features' => 'array',
            'sort_order' => 'integer',
            'is_active' => 'boolean',
            'deleted_at' => 'datetime',
        ];
    }

    public function section(): BelongsTo
    {
        return $this->belongsTo(PricingSection::class, 'pricing_section_id');
    }
}
