<?php

namespace App\Http\Controllers\Api;

use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use App\Traits\ApiResponseTrait;

class SiteSettingController extends Controller
{
    use ApiResponseTrait;

    protected array $validationRules = [
        'site_name' => 'nullable|string|max:255',
        'tagline' => 'nullable|string|max:500',
        'copyright_text' => 'nullable|string|max:255',
        'whatsapp_number' => 'nullable|string|max:30',
        'whatsapp_label' => 'nullable|string|max:100',
        'contact_email' => 'nullable|email|max:255',
        'phone' => 'nullable|string|max:30',
        'address' => 'nullable|string|max:500',
        'notification_email' => 'nullable|email|max:255',
        'logo_light_id' => 'nullable|integer|exists:media,id',
        'logo_dark_id' => 'nullable|integer|exists:media,id',
        'favicon_id' => 'nullable|integer|exists:media,id',
    ];

    public function show()
    {
        $settings = SiteSetting::with(['logoLight', 'logoDark', 'favicon'])->first();

        if (!$settings) {
            $settings = new SiteSetting();
        }

        return $this->successResponse($settings, 'Site settings retrieved successfully');
    }

    public function update(Request $request)
    {
        $validated = $request->validate($this->validationRules);

        $settings = SiteSetting::first();

        if ($settings) {
            $settings->update($validated);
            $message = 'Site settings updated successfully';
        } else {
            $settings = SiteSetting::create($validated);
            $message = 'Site settings created successfully';
        }

        $settings->load(['logoLight', 'logoDark', 'favicon']);

        activity('sitesetting')
            ->causedBy($request->user())
            ->performedOn($settings)
            ->event('updated')
            ->withProperties(['attributes' => $settings->getAttributes()])
            ->log('Site settings were updated');

        return $this->successResponse($settings, $message);
    }
}
