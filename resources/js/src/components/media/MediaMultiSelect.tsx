import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import GenericModal from "../GenericModal";
import { mediaApi } from "../../services/media";
import { IMedia } from "../../types";

interface MediaMultiSelectProps {
    label: string;
    value: number[];
    selectedMedia?: IMedia[];
    onChange: (mediaIds: number[], media?: IMedia[]) => void;
}

const MediaMultiSelect: React.FC<MediaMultiSelectProps> = ({
    label,
    value,
    selectedMedia = [],
    onChange,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [pendingIds, setPendingIds] = useState<number[]>(value);

    const { data: mediaResponse, isLoading } = useQuery({
        queryKey: ["Media Picker"],
        queryFn: () =>
            mediaApi.getAll({ per_page: 100, sort_by: "created_at", sort_direction: "desc" }),
        enabled: isOpen,
    });

    const previewItems =
        selectedMedia.length > 0
            ? selectedMedia
            : value.map((id) => ({ id, url: "", original_name: `Media #${id}` } as IMedia));

    const openPicker = () => {
        setPendingIds(value);
        setIsOpen(true);
    };

    const toggleSelection = (media: IMedia) => {
        setPendingIds((current) =>
            current.includes(media.id)
                ? current.filter((id) => id !== media.id)
                : [...current, media.id]
        );
    };

    const applySelection = () => {
        const mediaItems = (mediaResponse?.data || []).filter((media) =>
            pendingIds.includes(media.id)
        );
        const ordered = pendingIds
            .map((id) => mediaItems.find((media) => media.id === id))
            .filter(Boolean) as IMedia[];
        onChange(pendingIds, ordered);
        setIsOpen(false);
    };

    const removeItem = (mediaId: number) => {
        onChange(
            value.filter((id) => id !== mediaId),
            selectedMedia.filter((media) => media.id !== mediaId)
        );
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {label}
            </label>

            <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                <div className="mb-3 flex flex-wrap gap-2">
                    {previewItems.length === 0 ? (
                        <span className="text-sm text-gray-400">No images selected</span>
                    ) : (
                        previewItems.map((media) => (
                            <div
                                key={media.id}
                                className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded bg-gray-100 dark:bg-gray-800"
                            >
                                {media.url ? (
                                    <img
                                        src={media.url}
                                        alt={media.original_name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <span className="px-1 text-[10px] text-gray-400">#{media.id}</span>
                                )}
                                <button
                                    type="button"
                                    className="absolute right-0 top-0 rounded-bl bg-red-500 px-1 text-[10px] text-white"
                                    onClick={() => removeItem(media.id)}
                                >
                                    x
                                </button>
                            </div>
                        ))
                    )}
                </div>

                <div className="flex gap-2">
                    <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        onClick={openPicker}
                    >
                        Select images
                    </button>
                    {value.length > 0 && (
                        <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => onChange([], [])}
                        >
                            Clear all
                        </button>
                    )}
                </div>
            </div>

            <GenericModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                title="Select Gallery Images"
                maxWidth="xl"
            >
                {isLoading ? (
                    <p className="text-center text-gray-500">Loading media...</p>
                ) : (
                    <>
                        <div className="grid max-h-[50vh] grid-cols-2 gap-4 overflow-y-auto sm:grid-cols-3 md:grid-cols-4">
                            {(mediaResponse?.data || []).map((media) => (
                                <button
                                    key={media.id}
                                    type="button"
                                    className={`rounded-lg border p-2 text-left transition hover:border-primary ${
                                        pendingIds.includes(media.id)
                                            ? "border-primary ring-2 ring-primary/20"
                                            : "border-gray-200 dark:border-gray-700"
                                    }`}
                                    onClick={() => toggleSelection(media)}
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
                        </div>
                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                type="button"
                                className="btn btn-outline-danger"
                                onClick={() => setIsOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={applySelection}
                            >
                                Apply ({pendingIds.length})
                            </button>
                        </div>
                    </>
                )}
            </GenericModal>
        </div>
    );
};

export default MediaMultiSelect;
