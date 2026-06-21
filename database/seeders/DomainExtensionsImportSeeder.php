<?php

namespace Database\Seeders;

use App\Models\DomainExtension;
use Illuminate\Database\Seeder;

class DomainExtensionsImportSeeder extends Seeder
{
    public function run(): void
    {
        $rows = require __DIR__ . '/data/domain_extensions.php';

        foreach ($rows as $row) {
            DomainExtension::updateOrCreate(
                ['extension' => $row['extension']],
                $row
            );
        }
    }
}
