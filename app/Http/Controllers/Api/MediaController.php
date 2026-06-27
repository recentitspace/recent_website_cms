<?php

namespace App\Http\Controllers\Api;

use App\Models\Media;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;

class MediaController extends BaseController
{
    protected $model = Media::class;

    protected $searchableFields = ['original_name', 'filename', 'alt_text'];

    protected $sortableFields = ['id', 'original_name', 'size', 'mime_type', 'created_at', 'updated_at'];

    protected $relationships = ['uploader'];

    protected $validationRules = [
        'update' => [
            'alt_text' => 'nullable|string|max:255',
        ],
    ];

    public function store(Request $request)
    {
        $validated = $request->validate([
            'file' => 'required|file|mimes:jpeg,png,jpg,gif,svg,webp|max:5120',
            'alt_text' => 'nullable|string|max:255',
        ]);

        /** @var UploadedFile $file */
        $file = $validated['file'];

        $media = $this->createMediaFromUpload(
            $file,
            $validated['alt_text'] ?? null,
            $request
        );

        $this->logActivity(
            class_basename($this->model) . ' was created',
            $media,
            ['attributes' => $media->getAttributes()],
            'created'
        );

        return $this->createdResponse($media);
    }

    public function bulkStore(Request $request)
    {
        $validated = $request->validate([
            'files' => 'required|array|min:1|max:50',
            'files.*' => 'required|file|mimes:jpeg,png,jpg,gif,svg,webp|max:5120',
        ]);

        $created = [];

        foreach ($validated['files'] as $file) {
            $created[] = $this->createMediaFromUpload($file, null, $request);
        }

        $subject = $created[0] ?? new $this->model;
        $this->logActivity(
            class_basename($this->model) . ' records were bulk created',
            $subject,
            ['count' => count($created), 'ids' => collect($created)->pluck('id')->all()],
            'bulk_created'
        );

        $count = count($created);

        return $this->createdResponse([
            'created_count' => $count,
            'items' => $created,
        ], $count . ' files uploaded successfully');
    }

    protected function createMediaFromUpload(UploadedFile $file, ?string $altText, Request $request): Media
    {
        $originalName = $file->getClientOriginalName();
        $mimeType = $file->getClientMimeType() ?: $file->getMimeType();
        $size = $file->getSize();

        $year = date('Y');
        $month = date('m');
        $extension = $file->getClientOriginalExtension();
        $filename = uniqid('media_', true) . '.' . $extension;
        $relativePath = "assets/images/media/{$year}/{$month}/{$filename}";
        $fullPath = public_path($relativePath);

        $directory = dirname($fullPath);
        if (!is_dir($directory)) {
            mkdir($directory, 0755, true);
        }

        $file->move($directory, $filename);

        $media = $this->model::create([
            'filename' => $filename,
            'original_name' => $originalName,
            'mime_type' => $mimeType,
            'size' => $size,
            'path' => $relativePath,
            'alt_text' => $altText,
            'uploaded_by' => $request->user()?->id,
        ]);

        if (!empty($this->relationships)) {
            $media->load($this->relationships);
        }

        return $media;
    }

    public function destroy($id)
    {
        $media = $this->model::find($id);
        if (!$media) {
            return $this->notFoundResponse();
        }

        $this->deleteFile($media);
        $media->delete();

        $this->logActivity(
            class_basename($this->model) . ' was deleted',
            $media,
            ['old' => $media->getOriginal()],
            'deleted'
        );

        return $this->noContentResponse('Media deleted successfully');
    }

    public function bulkDelete(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'required|integer|exists:media,id',
        ]);

        $mediaItems = $this->model::whereIn('id', $validated['ids'])->get();

        foreach ($mediaItems as $media) {
            $this->deleteFile($media);
        }

        $count = $this->model::whereIn('id', $validated['ids'])->delete();

        $subject = $mediaItems->first() ?: new $this->model;
        $this->logActivity(
            class_basename($this->model) . ' records were bulk deleted',
            $subject,
            ['ids' => $validated['ids'], 'count' => $count],
            'bulk_deleted'
        );

        return $this->successResponse([
            'deleted_count' => $count,
        ], $count . ' records have been deleted');
    }

    protected function deleteFile(Media $media): void
    {
        $fullPath = public_path(ltrim($media->path, '/'));

        if (is_file($fullPath)) {
            unlink($fullPath);
        }
    }
}
