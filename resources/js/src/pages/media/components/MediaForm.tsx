import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import ActionButton from "../../../components/ActionButton";
import Alert from "../../../components/Alert";
import FormInput from "../../../components/form/FormInput";
import { mediaApi } from "../../../services/media";
import { IMedia } from "../../../types";

const uploadSchema = z.object({
    alt_text: z.string().max(255).optional().nullable(),
});

const editSchema = z.object({
    alt_text: z.string().max(255).optional().nullable(),
});

type UploadFormData = z.infer<typeof uploadSchema>;
type EditFormData = z.infer<typeof editSchema>;

const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) {
        return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

interface MediaFormProps {
    mediaToEdit?: IMedia | null;
    onClose: () => void;
}

const MediaForm: React.FC<MediaFormProps> = ({ mediaToEdit, onClose }) => {
    const queryClient = useQueryClient();
    const [generalError, setGeneralError] = useState<string | null>(null);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const isEditMode = Boolean(mediaToEdit);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<UploadFormData | EditFormData>({
        resolver: zodResolver(isEditMode ? editSchema : uploadSchema),
        defaultValues: {
            alt_text: "",
        },
    });

    useEffect(() => {
        if (mediaToEdit) {
            reset({
                alt_text: mediaToEdit.alt_text || "",
            });
        }
    }, [mediaToEdit, reset]);

    const invalidateMediaQueries = () => {
        queryClient.invalidateQueries({ queryKey: ["Media Table"] });
        queryClient.invalidateQueries({ queryKey: ["editor-media-library"] });
        queryClient.invalidateQueries({ queryKey: ["Media Picker"] });
    };

    const uploadMutation = useMutation({
        mutationFn: async (data: UploadFormData) => {
            if (selectedFiles.length === 0) {
                throw new Error("Please select at least one file to upload");
            }

            if (selectedFiles.length === 1) {
                const formData = new FormData();
                formData.append("file", selectedFiles[0]);
                if (data.alt_text) {
                    formData.append("alt_text", data.alt_text);
                }

                return mediaApi.upload(formData);
            }

            const formData = new FormData();
            selectedFiles.forEach((file) => {
                formData.append("files[]", file);
            });

            return mediaApi.bulkUpload(formData);
        },
        onSuccess: (result) => {
            invalidateMediaQueries();

            if (selectedFiles.length === 1) {
                toast.success("Media uploaded successfully");
            } else if (result && "created_count" in result) {
                toast.success(`${result.created_count} files uploaded successfully`);
            } else {
                toast.success("Media uploaded successfully");
            }

            onClose();
        },
        onError: (error: any) => {
            setGeneralError(error?.message || "Failed to upload media");
        },
    });

    const updateMutation = useMutation({
        mutationFn: (data: EditFormData) =>
            mediaApi.update(mediaToEdit!.id, { alt_text: data.alt_text || null }),
        onSuccess: () => {
            invalidateMediaQueries();
            queryClient.invalidateQueries({ queryKey: ["media", mediaToEdit?.id] });
            toast.success("Media updated successfully");
            onClose();
        },
        onError: (error: any) => {
            setGeneralError(error?.message || "Failed to update media");
        },
    });

    const onSubmit = (data: UploadFormData | EditFormData) => {
        setGeneralError(null);

        if (isEditMode) {
            updateMutation.mutate(data as EditFormData);
            return;
        }

        uploadMutation.mutate(data as UploadFormData);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        setSelectedFiles(files);
    };

    const removeFile = (index: number) => {
        setSelectedFiles((current) => current.filter((_, fileIndex) => fileIndex !== index));
    };

    const isBulkUpload = !isEditMode && selectedFiles.length > 1;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {generalError && <Alert type="danger" message={generalError} />}

            {!isEditMode && (
                <div>
                    <label className="mb-2 block font-medium">Files</label>
                    <input
                        type="file"
                        multiple
                        accept="image/jpeg,image/png,image/jpg,image/gif,image/svg+xml,image/webp"
                        className="form-input"
                        onChange={handleFileChange}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                        Select one or more images. JPEG, PNG, GIF, SVG, or WebP. Max 5MB each, up to 50 files.
                    </p>

                    {selectedFiles.length > 0 && (
                        <div className="mt-3 max-h-48 space-y-2 overflow-y-auto rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {selectedFiles.length} file{selectedFiles.length === 1 ? "" : "s"} selected
                            </p>
                            {selectedFiles.map((file, index) => (
                                <div
                                    key={`${file.name}-${file.size}-${index}`}
                                    className="flex items-center justify-between gap-3 rounded-md bg-gray-50 px-3 py-2 text-sm dark:bg-gray-800"
                                >
                                    <div className="min-w-0">
                                        <p className="truncate font-medium text-gray-900 dark:text-white">
                                            {file.name}
                                        </p>
                                        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                                    </div>
                                    <button
                                        type="button"
                                        className="shrink-0 text-sm text-red-500 hover:text-red-600"
                                        onClick={() => removeFile(index)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {isEditMode && mediaToEdit && (
                <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                    <img
                        src={mediaToEdit.url}
                        alt={mediaToEdit.alt_text || mediaToEdit.original_name}
                        className="max-h-48 w-full rounded object-contain"
                    />
                </div>
            )}

            {!isBulkUpload && (
                <Controller
                    name="alt_text"
                    control={control}
                    render={({ field }) => (
                        <FormInput
                            label="Alt Text"
                            placeholder="Optional description for accessibility"
                            error={errors.alt_text?.message}
                            value={field.value || ""}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                        />
                    )}
                />
            )}

            {isBulkUpload && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Alt text can be added individually after upload by editing each image.
                </p>
            )}

            <div className="mt-8 flex justify-end">
                <ActionButton
                    type="button"
                    variant="outline-danger"
                    onClick={onClose}
                    isLoading={false}
                    displayText="Cancel"
                    disabled={isSubmitting}
                />
                <ActionButton
                    type="submit"
                    variant="primary"
                    isLoading={isSubmitting}
                    loadingText={isEditMode ? "Updating..." : "Uploading..."}
                    displayText={
                        isEditMode
                            ? "Update"
                            : selectedFiles.length > 1
                              ? `Upload ${selectedFiles.length} files`
                              : "Upload"
                    }
                    className="ltr:ml-4 rtl:mr-4"
                />
            </div>
        </form>
    );
};

export default MediaForm;
