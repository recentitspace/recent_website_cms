import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import GenericModal from "../GenericModal";
import { mediaApi } from "../../services/media";
import { IMedia } from "../../types";

interface MediaSelectProps {
    label: string;
    value: number | null | undefined;
    selectedMedia?: IMedia | null;
    onChange: (mediaId: number | null, media?: IMedia | null) => void;
}

const MediaSelect: React.FC<MediaSelectProps> = ({
    label,
    value,
    selectedMedia,
    onChange,
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const { data: mediaResponse, isLoading } = useQuery({
        queryKey: ["Media Picker"],
        queryFn: () => mediaApi.getAll({ per_page: 100, sort_by: "created_at", sort_direction: "desc" }),
        enabled: isOpen,
    });

    const previewMedia = selectedMedia || null;
    const previewUrl = previewMedia?.url;

    const handleSelect = (media: IMedia) => {
        onChange(media.id, media);
        setIsOpen(false);
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {label}
            </label>

            <div className="flex items-center gap-4 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded bg-gray-100 dark:bg-gray-800">
                    {previewUrl ? (
                        <img
                            src={previewUrl}
                            alt={previewMedia?.alt_text || previewMedia?.original_name || label}
                            className="h-full w-full object-contain"
                        />
                    ) : (
                        <span className="text-xs text-gray-400">No image</span>
                    )}
                </div>

                <div className="flex flex-1 flex-wrap gap-2">
                    <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => setIsOpen(true)}
                    >
                        Select from library
                    </button>
                    {value && (
                        <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => onChange(null, null)}
                        >
                            Clear
                        </button>
                    )}
                </div>
            </div>

            <GenericModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                title="Select Media"
                maxWidth="xl"
            >
                {isLoading ? (
                    <p className="text-center text-gray-500">Loading media...</p>
                ) : (
                    <div className="grid max-h-[60vh] grid-cols-2 gap-4 overflow-y-auto sm:grid-cols-3 md:grid-cols-4">
                        {(mediaResponse?.data || []).map((media) => (
                            <button
                                key={media.id}
                                type="button"
                                className={`rounded-lg border p-2 text-left transition hover:border-primary ${
                                    value === media.id
                                        ? "border-primary ring-2 ring-primary/20"
                                        : "border-gray-200 dark:border-gray-700"
                                }`}
                                onClick={() => handleSelect(media)}
                            >
                                <img
                                    src={media.url}
                                    alt={media.alt_text || media.original_name}
                                    className="mb-2 h-24 w-full rounded object-cover"
                                />
                                <p className="truncate text-xs font-medium">
                                    {media.original_name}
                                </p>
                            </button>
                        ))}
                        {(mediaResponse?.data || []).length === 0 && (
                            <p className="col-span-full text-center text-gray-500">
                                No media found. Upload images in Media Library first.
                            </p>
                        )}
                    </div>
                )}
            </GenericModal>
        </div>
    );
};

export default MediaSelect;
