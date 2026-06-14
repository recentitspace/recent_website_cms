<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SiteSetting extends Model
{
    protected $fillable = [
        'site_name',
        'tagline',
        'copyright_text',
        'whatsapp_number',
        'whatsapp_label',
        'contact_email',
        'phone',
        'address',
        'notification_email',
        'logo_light_id',
        'logo_dark_id',
        'favicon_id',
    ];

    protected function casts(): array
    {
        return [
            'logo_light_id' => 'integer',
            'logo_dark_id' => 'integer',
            'favicon_id' => 'integer',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
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

    public function favicon(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'favicon_id');
    }
}
