<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Faq extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'service_category_id',
        'question',
        'answer_paragraphs',
        'sort_order',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'service_category_id' => 'integer',
            'answer_paragraphs' => 'array',
            'sort_order' => 'integer',
            'is_active' => 'boolean',
            'deleted_at' => 'datetime',
        ];
    }

    public function serviceCategory(): BelongsTo
    {
        return $this->belongsTo(ServiceCategory::class, 'service_category_id');
    }
}
