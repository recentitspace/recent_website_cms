<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ValidatePublicApiKey
{
    public function handle(Request $request, Closure $next): Response
    {
        $configuredKey = config('cms_public_api.api_key');

        if (!is_string($configuredKey) || $configuredKey === '') {
            return response()->json([
                'success' => false,
                'message' => 'Public API is not configured',
                'errors' => [
                    'api_key' => ['PUBLIC_API_KEY is not set on the server'],
                ],
                'status_code' => 503,
            ], 503);
        }

        $providedKey = $this->resolveProvidedKey($request);

        if ($providedKey === null || !hash_equals($configuredKey, $providedKey)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or missing API key',
                'errors' => [
                    'api_key' => ['Provide a valid key via X-Public-Api-Key or Authorization: Bearer'],
                ],
                'status_code' => 401,
            ], 401);
        }

        return $next($request);
    }

    private function resolveProvidedKey(Request $request): ?string
    {
        $headerKey = $request->header('X-Public-Api-Key');
        if (is_string($headerKey) && $headerKey !== '') {
            return $headerKey;
        }

        $authorization = $request->header('Authorization');
        if (is_string($authorization) && str_starts_with($authorization, 'Bearer ')) {
            $token = trim(substr($authorization, 7));

            return $token !== '' ? $token : null;
        }

        return null;
    }
}
