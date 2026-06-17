<?php

namespace Database\Seeders;

use App\Concerns\ImportsRwebMedia;
use App\Models\SiteSetting;
use App\Models\SocialLink;
use Illuminate\Database\Seeder;

class WebsiteContentSeeder extends Seeder
{
    use ImportsRwebMedia;

    public function run(): void
    {
        $logoLightId = $this->importMediaFromPath('assets/images/logo/logo.png', 'site');
        $logoDarkId = $this->importMediaFromPath('assets/images/logo/logo-dark.png', 'site');
        $faviconId = $this->importMediaFromPath('assets/images/favicon.png', 'site');

        SiteSetting::updateOrCreate(
            ['id' => 1],
            [
                'site_name' => 'Recent IT',
                'tagline' => 'We transform your ideas into reality through innovative technology.',
                'copyright_text' => '© Recent-IT 2026 | All Rights Reserved',
                'whatsapp_number' => '252611333381',
                'whatsapp_label' => "Let's Talk",
                'contact_email' => 'info@recent.so',
                'phone' => '+252611333381',
                'address' => 'Taleex, Hodan, Mogadishu, Somalia',
                'notification_email' => 'info@recent.so',
                'logo_light_id' => $logoLightId,
                'logo_dark_id' => $logoDarkId,
                'favicon_id' => $faviconId,
            ]
        );

        $socialLinks = [
            ['platform' => 'facebook', 'url' => 'https://www.facebook.com/recent.so', 'sort_order' => 1],
            ['platform' => 'instagram', 'url' => 'https://www.instagram.com/recent.so', 'sort_order' => 2],
            ['platform' => 'tiktok', 'url' => 'https://www.tiktok.com/@recent.so', 'sort_order' => 3],
            ['platform' => 'linkedin', 'url' => 'https://so.linkedin.com/company/recent-so', 'sort_order' => 4],
        ];

        foreach ($socialLinks as $link) {
            SocialLink::firstOrCreate(
                ['platform' => $link['platform'], 'url' => $link['url']],
                [
                    'sort_order' => $link['sort_order'],
                    'is_active' => true,
                ]
            );
        }
    }
}
