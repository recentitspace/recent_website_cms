<?php

namespace App\Enums;

enum DomainRequestStatus: string
{
    case PENDING = 'pending';
    case CONTACTED = 'contacted';
    case CANCELED = 'canceled';
    case COMPLETED = 'completed';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
