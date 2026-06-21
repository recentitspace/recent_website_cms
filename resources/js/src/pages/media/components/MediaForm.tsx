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

interface MediaFormProps {
    mediaToEdit?: IMedia | null;
    onClose: () => void;
}

const MediaForm: React.FC<MediaFormProps> = ({ mediaToEdit, onClose }) => {
    const queryClient = useQueryClient();
    const [generalError, setGeneralError] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
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

    const uploadMutation = useMutation({
        mutationFn: async (data: UploadFormData) => {
            if (!selectedFile) {
                throw new Error("Please select a file to upload");
            }

            const formData = new FormData();
            formData.append("file", selectedFile);
            if (data.alt_text) {
                formData.append("alt_text", data.alt_text);
            }

            return mediaApi.upload(formData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["Media Table"] });
            queryClient.invalidateQueries({ queryKey: ["editor-media-library"] });
            toast.success("Media uploaded successfully");
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
            queryClient.invalidateQueries({ queryKey: ["Media Table"] });
            queryClient.invalidateQueries({ queryKey: ["editor-media-library"] });
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

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {generalError && <Alert type="danger" message={generalError} />}

            {!isEditMode && (
                <div>
                    <label className="mb-2 block font-medium">File</label>
                    <input
                        type="file"
                        accept="image/jpeg,image/png,image/jpg,image/gif,image/svg+xml,image/webp"
                        className="form-input"
                        onChange={(event) => {
                            const file = event.target.files?.[0] || null;
                            setSelectedFile(file);
                        }}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                        JPEG, PNG, GIF, SVG, or WebP. Max 5MB.
                    </p>
                    {selectedFile && (
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                            Selected: {selectedFile.name}
                        </p>
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
                    displayText={isEditMode ? "Update" : "Upload"}
                    className="ltr:ml-4 rtl:mr-4"
                />
            </div>
        </form>
    );
};

export default MediaForm;
