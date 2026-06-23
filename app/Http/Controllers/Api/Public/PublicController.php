<?php

namespace App\Http\Controllers\Api\Public;

use Illuminate\Routing\Controller;
use App\Traits\ApiResponseTrait;

abstract class PublicController extends Controller
{
    use ApiResponseTrait;

    protected function parseBooleanQuery(?string $value): ?bool
    {
        if ($value === null || $value === '') {
            return null;
        }

        return filter_var($value, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
    }
}
