import { useQuery } from "@tanstack/react-query";
import React from "react";
import { mediaApi } from "../../../services/media";

interface MediaDetailProps {
    mediaId: number | null;
}

const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) {
        return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const MediaDetail: React.FC<MediaDetailProps> = ({ mediaId }) => {
    const { data: media, isLoading } = useQuery({
        queryKey: ["media", mediaId],
        queryFn: () => (mediaId ? mediaApi.getById(mediaId) : null),
        enabled: !!mediaId,
    });

    if (isLoading) {
        return null;
    }

    if (!media) {
        return (
            <div className="flex h-full items-center justify-center">
                <p className="text-gray-500">No media selected</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                <img
                    src={media.url}
                    alt={media.alt_text || media.original_name}
                    className="max-h-64 w-full bg-gray-50 object-contain dark:bg-gray-900"
                />
            </div>

            <div>
                <h3 className="mb-1 text-xl font-bold">{media.original_name}</h3>
                <p className="text-sm text-gray-500">{media.filename}</p>
            </div>

            <div className="space-y-3 text-sm">
                <div>
                    <span className="font-medium text-gray-500">MIME Type</span>
                    <p>{media.mime_type}</p>
                </div>
                <div>
                    <span className="font-medium text-gray-500">Size</span>
                    <p>{formatFileSize(media.size)}</p>
                </div>
                <div>
                    <span className="font-medium text-gray-500">Path</span>
                    <p className="break-all">{media.path}</p>
                </div>
                <div>
                    <span className="font-medium text-gray-500">URL</span>
                    <p className="break-all">{media.url}</p>
                </div>
                {media.alt_text && (
                    <div>
                        <span className="font-medium text-gray-500">Alt Text</span>
                        <p>{media.alt_text}</p>
                    </div>
                )}
                {media.uploader?.name && (
                    <div>
                        <span className="font-medium text-gray-500">Uploaded By</span>
                        <p>{media.uploader.name}</p>
                    </div>
                )}
                <div>
                    <span className="font-medium text-gray-500">Created At</span>
                    <p>
                        {media.created_at
                            ? new Date(media.created_at).toLocaleString()
                            : "N/A"}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MediaDetail;
