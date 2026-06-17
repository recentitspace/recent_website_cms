<?php

namespace App\Concerns;

use App\Models\Media;

trait ImportsRwebMedia
{
    protected function importMediaFromPath(?string $relativePath, string $subdir = 'rweb'): ?int
    {
        if (!$relativePath) {
            return null;
        }

        $normalizedPath = ltrim(str_replace('\\', '/', $relativePath), '/');
        $source = realpath(base_path('../R-web/public/' . $normalizedPath));

        if (!$source || !is_file($source)) {
            return null;
        }

        $hash = md5($normalizedPath);
        $filename = $hash . '_' . basename($source);
        $relativeDest = "assets/images/portfolio/imported/{$subdir}/{$filename}";
        $destDir = public_path("assets/images/portfolio/imported/{$subdir}");
        $dest = public_path($relativeDest);

        $existing = Media::where('path', $relativeDest)->first();
        if ($existing) {
            return $existing->id;
        }

        if (!is_dir($destDir)) {
            mkdir($destDir, 0755, true);
        }

        if (!copy($source, $dest)) {
            return null;
        }

        return Media::create([
            'filename' => $filename,
            'original_name' => basename($source),
            'mime_type' => mime_content_type($dest) ?: 'image/jpeg',
            'size' => filesize($dest) ?: 0,
            'path' => $relativeDest,
        ])->id;
    }
}
