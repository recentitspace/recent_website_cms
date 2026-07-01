<?php

namespace App\Models;

use App\Enums\DomainRequestStatus;
use Illuminate\Database\Eloquent\Model;

class DomainRequest extends Model
{
    protected $fillable = [
        'domain_name',
        'extension',
        'extension_price',
        'extension_period',
        'email',
        'phone',
        'address',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'status' => DomainRequestStatus::class,
        ];
    }

    protected $appends = [
        'full_domain',
    ];

    public function getFullDomainAttribute(): string
    {
        return $this->domain_name . $this->extension;
    }

    public static function normalizeDomainName(string $value): string
    {
        $value = strtolower(trim($value));
        $value = ltrim($value, 'www.');
        $value = trim($value, '.');

        $dotPos = strpos($value, '.');
        if ($dotPos !== false) {
            $value = substr($value, 0, $dotPos);
        }

        return (string) preg_replace('/[^a-z0-9\-]/', '', $value);
    }

    public static function normalizeExtension(string $value): string
    {
        $value = strtolower(trim($value));

        if ($value !== '' && !str_starts_with($value, '.')) {
            $value = '.' . $value;
        }

        return $value;
    }

    public static function normalizeEmail(string $value): string
    {
        return strtolower(trim($value));
    }

    public static function normalizePhone(string $value): string
    {
        return preg_replace('/\s+/', '', trim($value)) ?? '';
    }
}
