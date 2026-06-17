<?php

namespace Database\Seeders;

use App\Concerns\ImportsRwebMedia;
use App\Models\Client;
use App\Models\Testimonial;
use Illuminate\Database\Seeder;

class ClientsTestimonialsSeeder extends Seeder
{
    use ImportsRwebMedia;

    public function run(): void
    {
        $this->seedClientsFromData();
        $this->seedClientsFromDirectory();
        $this->seedTestimonials();
    }

    protected function seedClientsFromData(): void
    {
        $clients = require __DIR__ . '/data/clients.php';

        foreach ($clients as $clientData) {
            $logoId = $this->importMediaFromPath($clientData['image'] ?? null, 'clients');

            Client::updateOrCreate(
                [
                    'name' => $clientData['name'],
                    'show_on_home' => $clientData['show_on_home'] ?? false,
                ],
                [
                    'logo_id' => $logoId,
                    'url' => $clientData['url'] ?? null,
                    'sort_order' => $clientData['sort_order'] ?? 0,
                    'is_active' => true,
                ]
            );
        }
    }

    protected function seedClientsFromDirectory(): void
    {
        $directory = realpath(base_path('../R-web/public/assets/images/Client Logos'));

        if (!$directory || !is_dir($directory)) {
            return;
        }

        $files = scandir($directory) ?: [];
        $sortOrder = Client::max('sort_order') ?? 0;

        foreach ($files as $file) {
            if ($file === '.' || $file === '..') {
                continue;
            }

            $extension = strtolower(pathinfo($file, PATHINFO_EXTENSION));
            if (!in_array($extension, ['jpg', 'jpeg', 'png', 'gif', 'webp'], true)) {
                continue;
            }

            $name = pathinfo($file, PATHINFO_FILENAME);
            $relativePath = 'assets/images/Client Logos/' . $file;
            $logoId = $this->importMediaFromPath($relativePath, 'clients');

            $sortOrder++;

            Client::updateOrCreate(
                ['name' => $name],
                [
                    'logo_id' => $logoId,
                    'url' => null,
                    'sort_order' => $sortOrder,
                    'is_active' => true,
                    'show_on_home' => false,
                ]
            );
        }
    }

    protected function seedTestimonials(): void
    {
        $testimonials = require __DIR__ . '/data/testimonials.php';

        foreach ($testimonials as $testimonialData) {
            Testimonial::updateOrCreate(
                [
                    'author_name' => $testimonialData['author_name'],
                    'quote' => $testimonialData['quote'],
                ],
                [
                    'author_role' => $testimonialData['author_role'] ?? null,
                    'logo_light_id' => $this->importMediaFromPath($testimonialData['logo_light'] ?? null, 'testimonials'),
                    'logo_dark_id' => $this->importMediaFromPath($testimonialData['logo_dark'] ?? null, 'testimonials'),
                    'avatar_id' => $this->importMediaFromPath($testimonialData['avatar'] ?? null, 'testimonials'),
                    'sort_order' => $testimonialData['sort_order'] ?? 0,
                    'is_active' => true,
                    'show_on_home' => $testimonialData['show_on_home'] ?? true,
                ]
            );
        }
    }
}
