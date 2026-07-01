<?php

namespace App\Http\Controllers\Api\Public;

use App\Enums\DomainRequestStatus;
use App\Models\DomainRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PublicDomainRequestController extends PublicController
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'domain_name' => 'required|string|max:63',
            'extension' => 'required|string|max:50',
            'extension_price' => 'required|string|max:50',
            'extension_period' => 'nullable|string|max:20',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:50',
            'address' => 'required|string|max:500',
        ]);

        $domainName = DomainRequest::normalizeDomainName($validated['domain_name']);
        $extension = DomainRequest::normalizeExtension($validated['extension']);
        $email = DomainRequest::normalizeEmail($validated['email']);
        $phone = DomainRequest::normalizePhone($validated['phone']);

        if ($domainName === '' || $extension === '' || $phone === '') {
            return $this->validationErrorResponse([
                'domain_name' => ['Please enter a valid domain name.'],
            ]);
        }

        $duplicate = DomainRequest::query()
            ->where('domain_name', $domainName)
            ->where('extension', $extension)
            ->where(function ($query) use ($email, $phone) {
                $query
                    ->where('email', $email)
                    ->orWhere('phone', $phone);
            })
            ->exists();

        if ($duplicate) {
            return $this->errorResponse(
                'You have already requested this domain. Try a different name or extension, or contact us directly.',
                ['domain' => ['A request for this domain already exists with your email or phone number.']],
                422
            );
        }

        $domainRequest = DomainRequest::create([
            'domain_name' => $domainName,
            'extension' => $extension,
            'extension_price' => ltrim(trim($validated['extension_price']), '$'),
            'extension_period' => trim((string) ($validated['extension_period'] ?? '/yr')) ?: '/yr',
            'email' => $email,
            'phone' => $phone,
            'address' => trim($validated['address']),
            'status' => DomainRequestStatus::PENDING,
        ]);

        return $this->successResponse(
            $domainRequest,
            'Domain request submitted successfully. Our team will contact you shortly.',
            201
        );
    }
}
