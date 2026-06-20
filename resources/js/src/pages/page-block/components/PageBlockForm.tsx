import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import ActionButton from "../../../components/ActionButton";
import Alert from "../../../components/Alert";
import MediaSelect from "../../../components/media/MediaSelect";
import FormInput from "../../../components/form/FormInput";
import FormSelect from "../../../components/form/FormSelect";
import FormTextarea from "../../../components/form/FormTextarea";
import { pageBlockApi } from "../../../services/pageBlock";
import { IMedia, IPageBlock, PageName } from "../../../types";

const pageOptions = [
    { value: "home", label: "Home" },
    { value: "about", label: "About" },
    { value: "faq", label: "FAQ" },
    { value: "contact", label: "Contact" },
];

const pageBlockSchema = z.object({
    page: z.enum(["home", "about", "faq", "contact"]),
    key: z.string().min(1, "Key is required"),
    title: z.string().optional(),
    subtitle: z.string().optional(),
    body: z.string().optional(),
    image_id: z.number().nullable().optional(),
    cta_text: z.string().optional(),
    cta_url: z.string().optional().or(z.literal("")),
    cta_secondary_text: z.string().optional(),
    cta_secondary_url: z.string().optional().or(z.literal("")),
    video_url: z.string().optional().or(z.literal("")),
    sort_order: z.coerce.number().min(0).optional(),
    is_active: z.boolean().optional(),
});

type PageBlockFormData = z.infer<typeof pageBlockSchema>;

interface PageBlockFormProps {
    blockToEdit?: IPageBlock | null;
    onClose: () => void;
}

const PageBlockForm: React.FC<PageBlockFormProps> = ({ blockToEdit, onClose }) => {
    const queryClient = useQueryClient();
    const [generalError, setGeneralError] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<IMedia | null>(null);
    const isEditMode = Boolean(blockToEdit);

    const { data: fullBlock } = useQuery({
        queryKey: ["page-block", blockToEdit?.id],
        queryFn: () => pageBlockApi.getById(blockToEdit!.id),
        enabled: Boolean(blockToEdit?.id),
    });

    const editBlock = fullBlock || blockToEdit;

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<PageBlockFormData>({
        resolver: zodResolver(pageBlockSchema),
        defaultValues: {
            page: "home",
            key: "",
            title: "",
            subtitle: "",
            body: "",
            image_id: null,
            cta_text: "",
            cta_url: "",
            cta_secondary_text: "",
            cta_secondary_url: "",
            video_url: "",
            sort_order: 0,
            is_active: true,
        },
    });

    useEffect(() => {
        if (editBlock) {
            reset({
                page: editBlock.page as PageName,
                key: editBlock.key,
                title: editBlock.title || "",
                subtitle: editBlock.subtitle || "",
                body: editBlock.body || "",
                image_id: editBlock.image_id || null,
                cta_text: editBlock.cta_text || "",
                cta_url: editBlock.cta_url || "",
                cta_secondary_text: editBlock.cta_secondary_text || "",
                cta_secondary_url: editBlock.cta_secondary_url || "",
                video_url: editBlock.video_url || "",
                sort_order: editBlock.sort_order,
                is_active: editBlock.is_active,
            });
            setSelectedImage(editBlock.image || null);
        }
    }, [editBlock, reset]);

    const createMutation = useMutation({
        mutationFn: (data: PageBlockFormData) =>
            pageBlockApi.create({
                ...data,
                title: data.title?.trim() || null,
                subtitle: data.subtitle?.trim() || null,
                body: data.body?.trim() || null,
                image_id: data.image_id || null,
                cta_text: data.cta_text?.trim() || null,
                cta_url: data.cta_url?.trim() || null,
                cta_secondary_text: data.cta_secondary_text?.trim() || null,
                cta_secondary_url: data.cta_secondary_url?.trim() || null,
                video_url: data.video_url?.trim() || null,
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["Page Block Table"] });
            queryClient.invalidateQueries({ queryKey: ["Page Blocks Select"] });
            toast.success("Page block created successfully");
            onClose();
        },
        onError: (error: any) => {
            setGeneralError(error?.message || "Failed to create page block");
        },
    });

    const updateMutation = useMutation({
        mutationFn: (data: PageBlockFormData) =>
            pageBlockApi.update(editBlock!.id, {
                ...data,
                title: data.title?.trim() || null,
                subtitle: data.subtitle?.trim() || null,
                body: data.body?.trim() || null,
                image_id: data.image_id || null,
                cta_text: data.cta_text?.trim() || null,
                cta_url: data.cta_url?.trim() || null,
                cta_secondary_text: data.cta_secondary_text?.trim() || null,
                cta_secondary_url: data.cta_secondary_url?.trim() || null,
                video_url: data.video_url?.trim() || null,
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["Page Block Table"] });
            queryClient.invalidateQueries({ queryKey: ["Page Blocks Select"] });
            queryClient.invalidateQueries({ queryKey: ["page-block", editBlock?.id] });
            toast.success("Page block updated successfully");
            onClose();
        },
        onError: (error: any) => {
            setGeneralError(error?.message || "Failed to update page block");
        },
    });

    const onSubmit = (data: PageBlockFormData) => {
        setGeneralError(null);
        if (isEditMode) {
            updateMutation.mutate(data);
        } else {
            createMutation.mutate(data);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {generalError && <Alert type="danger" message={generalError} />}

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Controller
                    name="page"
                    control={control}
                    render={({ field }) => (
                        <FormSelect
                            label="Page"
                            options={pageOptions}
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            error={errors.page?.message}
                        />
                    )}
                />

                <Controller
                    name="key"
                    control={control}
                    render={({ field }) => (
                        <FormInput
                            label="Key"
                            value={field.value || ""}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            error={errors.key?.message}
                            placeholder="e.g. hero, about_intro"
                        />
                    )}
                />
            </div>

            <Controller
                name="title"
                control={control}
                render={({ field }) => (
                    <FormInput
                        label="Title"
                        value={field.value || ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        error={errors.title?.message}
                    />
                )}
            />

            <Controller
                name="subtitle"
                control={control}
                render={({ field }) => (
                    <FormInput
                        label="Subtitle"
                        value={field.value || ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        error={errors.subtitle?.message}
                    />
                )}
            />

            <Controller
                name="body"
                control={control}
                render={({ field }) => (
                    <FormTextarea
                        label="Body"
                        value={field.value || ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        error={errors.body?.message}
                        rows={4}
                    />
                )}
            />

            <Controller
                name="image_id"
                control={control}
                render={({ field }) => (
                    <MediaSelect
                        label="Image"
                        value={field.value}
                        selectedMedia={selectedImage}
                        onChange={(mediaId, media) => {
                            field.onChange(mediaId);
                            setSelectedImage(media || null);
                        }}
                    />
                )}
            />

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Controller
                    name="cta_text"
                    control={control}
                    render={({ field }) => (
                        <FormInput
                            label="CTA Text"
                            value={field.value || ""}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            error={errors.cta_text?.message}
                        />
                    )}
                />

                <Controller
                    name="cta_url"
                    control={control}
                    render={({ field }) => (
                        <FormInput
                            label="CTA URL"
                            value={field.value || ""}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            error={errors.cta_url?.message}
                        />
                    )}
                />
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Controller
                    name="cta_secondary_text"
                    control={control}
                    render={({ field }) => (
                        <FormInput
                            label="Secondary CTA Text"
                            value={field.value || ""}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            error={errors.cta_secondary_text?.message}
                        />
                    )}
                />

                <Controller
                    name="cta_secondary_url"
                    control={control}
                    render={({ field }) => (
                        <FormInput
                            label="Secondary CTA URL"
                            value={field.value || ""}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            error={errors.cta_secondary_url?.message}
                        />
                    )}
                />
            </div>

            <Controller
                name="video_url"
                control={control}
                render={({ field }) => (
                    <FormInput
                        label="Video URL"
                        value={field.value || ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        error={errors.video_url?.message}
                        placeholder="https://..."
                    />
                )}
            />

            <Controller
                name="sort_order"
                control={control}
                render={({ field }) => (
                    <FormInput
                        label="Sort Order"
                        type="number"
                        value={String(field.value ?? 0)}
                        onChange={(value) => field.onChange(Number(value))}
                        onBlur={field.onBlur}
                        error={errors.sort_order?.message}
                    />
                )}
            />

            <Controller
                name="is_active"
                control={control}
                render={({ field }) => (
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={field.value ?? true}
                            onChange={(event) => field.onChange(event.target.checked)}
                        />
                        <span>Active</span>
                    </label>
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
                    loadingText={isEditMode ? "Updating..." : "Saving..."}
                    displayText={isEditMode ? "Update" : "Save"}
                    className="ltr:ml-4 rtl:mr-4"
                />
            </div>
        </form>
    );
};

export default PageBlockForm;
