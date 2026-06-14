<?php

namespace Database\Seeders;

use App\Models\SiteSetting;
use App\Models\SocialLink;
use Illuminate\Database\Seeder;

class WebsiteContentSeeder extends Seeder
{
    public function run(): void
    {
        SiteSetting::firstOrCreate(
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
