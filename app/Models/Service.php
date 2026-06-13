<?php

namespace App\Models;

use App\Enums\ServiceStatus;
use App\Enums\ServiceType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Service extends Model
{
    protected $fillable = [
        'parent_id',
        'type',
        'slug',
        'name',
        'short_name',
        'icon',
        'hero_image',
        'banner_title',
        'banner_subtitle',
        'hero_title',
        'hero_title_highlight',
        'hero_description',
        'section_title',
        'section_subtitle',
        'cta_text',
        'cta_url',
        'portfolio_category',
        'pricing_category_slug',
        'show_in_nav',
        'show_on_homepage',
        'sort_order',
        'status',
        'meta_title',
        'meta_description',
    ];

    protected $casts = [
        'type' => ServiceType::class,
        'status' => ServiceStatus::class,
        'show_in_nav' => 'boolean',
        'show_on_homepage' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Service::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(Service::class, 'parent_id')->orderBy('sort_order');
    }

    public function features(): HasMany
    {
        return $this->hasMany(ServiceFeature::class)->orderBy('sort_order');
    }

    public function processSteps(): HasMany
    {
        return $this->hasMany(ServiceProcessStep::class)->orderBy('sort_order');
    }

    public function faqs(): HasMany
    {
        return $this->hasMany(ServiceFaq::class)->orderBy('sort_order');
    }

    public function isCategory(): bool
    {
        return $this->type === ServiceType::Category;
    }

    public function getUrlAttribute(): string
    {
        if ($this->isCategory()) {
            return '/services/' . $this->slug;
        }

        $parentSlug = $this->relationLoaded('parent')
            ? $this->parent?->slug
            : $this->parent()->value('slug');

        return '/services/' . $parentSlug . '/' . $this->slug;
    }

    public function scopePublished($query)
    {
        return $query->where('status', ServiceStatus::Published);
    }

    public function scopeCategories($query)
    {
        return $query->where('type', ServiceType::Category)->whereNull('parent_id');
    }
}
