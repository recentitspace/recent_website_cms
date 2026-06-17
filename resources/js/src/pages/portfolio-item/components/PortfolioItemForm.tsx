import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import ActionButton from "../../../components/ActionButton";
import Alert from "../../../components/Alert";
import MediaMultiSelect from "../../../components/media/MediaMultiSelect";
import MediaSelect from "../../../components/media/MediaSelect";
import FormInput from "../../../components/form/FormInput";
import FormSelect from "../../../components/form/FormSelect";
import { portfolioCategoryApi } from "../../../services/portfolioCategory";
import { portfolioItemApi } from "../../../services/portfolioItem";
import { IMedia, IPortfolioItem } from "../../../types";

const typeOptions = [
    { value: "image", label: "Image" },
    { value: "project", label: "Project" },
    { value: "video", label: "Video" },
];

const itemSchema = z
    .object({
    portfolio_category_id: z.coerce.number().min(1, "Category is required"),
    title: z.string().min(1, "Title is required"),
    slug: z.string().optional(),
    tags: z.string().optional(),
    type: z.enum(["image", "project", "video"]),
    thumbnail_id: z.number().nullable().optional(),
    external_link: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    youtube_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    featured: z.boolean().optional(),
    sort_order: z.coerce.number().min(0).optional(),
    is_published: z.boolean().optional(),
    show_on_home: z.boolean().optional(),
    home_sort_order: z.coerce.number().min(0).optional().nullable(),
    gallery_media_ids: z.array(z.number()).optional(),
})
    .superRefine((data, ctx) => {
        const hasExternal = Boolean(data.external_link && data.external_link.trim().length > 0);
        const galleryCount = data.gallery_media_ids?.length ?? 0;

        if (data.type === "video") {
            if (galleryCount > 0) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["gallery_media_ids"],
                    message: "Gallery is not allowed for video items",
                });
            }
            return;
        }

        if (hasExternal) {
            if (galleryCount > 0) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["gallery_media_ids"],
                    message: "Gallery is not allowed when External Link is set",
                });
            }
            return;
        }

        // internal image/project requires gallery
        if (galleryCount === 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["gallery_media_ids"],
                message: "Gallery images are required for internal portfolio items",
            });
        }
    });

type ItemFormData = z.infer<typeof itemSchema>;

interface PortfolioItemFormProps {
    itemToEdit?: IPortfolioItem | null;
    onClose: () => void;
}

const PortfolioItemForm: React.FC<PortfolioItemFormProps> = ({ itemToEdit, onClose }) => {
    const queryClient = useQueryClient();
    const [generalError, setGeneralError] = useState<string | null>(null);
    const [selectedMedia, setSelectedMedia] = useState<IMedia | null>(
        itemToEdit?.thumbnail || null
    );
    const [selectedGallery, setSelectedGallery] = useState<IMedia[]>([]);
    const isEditMode = Boolean(itemToEdit);

    const { data: fullItem } = useQuery({
        queryKey: ["portfolio-item", itemToEdit?.id],
        queryFn: () => portfolioItemApi.getById(itemToEdit!.id),
        enabled: Boolean(itemToEdit?.id),
    });

    const editItem = fullItem || itemToEdit;

    const { data: categoriesResponse } = useQuery({
        queryKey: ["Portfolio Categories Select"],
        queryFn: () =>
            portfolioCategoryApi.getAll({
                per_page: 100,
                sort_by: "sort_order",
                sort_direction: "asc",
            }),
    });

    const categoryOptions =
        categoriesResponse?.data?.map((category) => ({
            value: String(category.id),
            label: category.name,
        })) || [];

    const {
        control,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<ItemFormData>({
        resolver: zodResolver(itemSchema),
        defaultValues: {
            portfolio_category_id: 0,
            title: "",
            slug: "",
            tags: "",
            type: "image",
            thumbnail_id: null,
            external_link: "",
            youtube_url: "",
            featured: false,
            sort_order: 0,
            is_published: true,
            show_on_home: false,
            home_sort_order: null,
            gallery_media_ids: [],
        },
    });

    const selectedType = watch("type");
    const externalLinkValue = watch("external_link");
    const showOnHomeValue = watch("show_on_home");
    const isExternal = Boolean(externalLinkValue && externalLinkValue.trim().length > 0);

    useEffect(() => {
        if (editItem) {
            const galleryIds = editItem.gallery_images?.map((image) => image.media_id) || [];
            const galleryMedia =
                (editItem.gallery_images
                    ?.map((image) => image.media)
                    .filter(Boolean) as IMedia[]) || [];

            reset({
                portfolio_category_id: editItem.portfolio_category_id,
                title: editItem.title,
                slug: editItem.slug,
                tags: editItem.tags || "",
                type: editItem.type,
                thumbnail_id: editItem.thumbnail_id || null,
                external_link: editItem.external_link || "",
                youtube_url: editItem.youtube_url || "",
                featured: editItem.featured,
                sort_order: editItem.sort_order,
                is_published: editItem.is_published,
                show_on_home: editItem.show_on_home ?? false,
                home_sort_order: editItem.home_sort_order ?? null,
                gallery_media_ids: galleryIds,
            });
            setSelectedMedia(editItem.thumbnail || null);
            setSelectedGallery(galleryMedia);
        }
    }, [editItem, reset]);

    const createMutation = useMutation({
        mutationFn: (data: ItemFormData) => portfolioItemApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["Portfolio Item Table"] });
            toast.success("Portfolio item created successfully");
            onClose();
        },
        onError: (error: any) => {
            setGeneralError(error?.message || "Failed to create portfolio item");
        },
    });

    const updateMutation = useMutation({
        mutationFn: (data: ItemFormData) => portfolioItemApi.update(itemToEdit!.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["Portfolio Item Table"] });
            queryClient.invalidateQueries({ queryKey: ["portfolio-item", itemToEdit?.id] });
            toast.success("Portfolio item updated successfully");
            onClose();
        },
        onError: (error: any) => {
            setGeneralError(error?.message || "Failed to update portfolio item");
        },
    });

    const onSubmit = (data: ItemFormData) => {
        setGeneralError(null);
        const payload = {
            ...data,
            slug: data.slug?.trim() || undefined,
            tags: data.tags?.trim() || null,
            external_link: data.external_link?.trim() || null,
            youtube_url: data.youtube_url?.trim() || null,
            thumbnail_id: data.thumbnail_id || null,
            home_sort_order: data.show_on_home ? data.home_sort_order ?? 0 : null,
        };

        if (isEditMode) {
            updateMutation.mutate(payload);
        } else {
            createMutation.mutate(payload);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {generalError && <Alert type="danger" message={generalError} />}

            <Controller
                name="portfolio_category_id"
                control={control}
                render={({ field }) => (
                    <FormSelect
                        label="Category"
                        options={categoryOptions}
                        value={String(field.value || "")}
                        onChange={(value) => field.onChange(Number(value))}
                        onBlur={field.onBlur}
                        error={errors.portfolio_category_id?.message}
                    />
                )}
            />

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
                name="slug"
                control={control}
                render={({ field }) => (
                    <FormInput
                        label="Slug (optional)"
                        value={field.value || ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        error={errors.slug?.message}
                    />
                )}
            />

            <Controller
                name="tags"
                control={control}
                render={({ field }) => (
                    <FormInput
                        label="Tags"
                        value={field.value || ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        error={errors.tags?.message}
                    />
                )}
            />

            <Controller
                name="type"
                control={control}
                render={({ field }) => (
                    <FormSelect
                        label="Type"
                        options={typeOptions}
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        error={errors.type?.message}
                    />
                )}
            />

            <Controller
                name="thumbnail_id"
                control={control}
                render={({ field }) => (
                    <MediaSelect
                        label="Thumbnail"
                        value={field.value}
                        selectedMedia={selectedMedia}
                        onChange={(mediaId, media) => {
                            field.onChange(mediaId);
                            setSelectedMedia(media || null);
                        }}
                    />
                )}
            />

            {selectedType !== "video" && (
                <Controller
                    name="external_link"
                    control={control}
                    render={({ field }) => (
                        <FormInput
                            label="External Link"
                            value={field.value || ""}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            error={errors.external_link?.message}
                        />
                    )}
                />
            )}

            {selectedType === "video" && (
                <Controller
                    name="youtube_url"
                    control={control}
                    render={({ field }) => (
                        <FormInput
                            label="YouTube URL"
                            value={field.value || ""}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            error={errors.youtube_url?.message}
                        />
                    )}
                />
            )}

            {selectedType !== "video" && !isExternal && (
                <Controller
                    name="gallery_media_ids"
                    control={control}
                    render={({ field }) => (
                        <MediaMultiSelect
                            label="Gallery Images (internal)"
                            value={field.value || []}
                            selectedMedia={selectedGallery}
                            onChange={(mediaIds, media) => {
                                field.onChange(mediaIds);
                                setSelectedGallery(media || []);
                            }}
                        />
                    )}
                />
            )}

            {selectedType !== "video" && isExternal && (
                <div className="text-xs text-gray-500">
                    Gallery is disabled because this item has an External Link.
                </div>
            )}

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
                name="featured"
                control={control}
                render={({ field }) => (
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={field.value ?? false}
                            onChange={(event) => field.onChange(event.target.checked)}
                        />
                        <span>Featured</span>
                    </label>
                )}
            />

            <Controller
                name="show_on_home"
                control={control}
                render={({ field }) => (
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={field.value ?? false}
                            onChange={(event) => field.onChange(event.target.checked)}
                        />
                        <span>Show on Home (Case Studies section)</span>
                    </label>
                )}
            />

            {showOnHomeValue && (
                <Controller
                    name="home_sort_order"
                    control={control}
                    render={({ field }) => (
                        <FormInput
                            label="Home Sort Order"
                            type="number"
                            value={String(field.value ?? 0)}
                            onChange={(value) => field.onChange(Number(value))}
                            onBlur={field.onBlur}
                            error={errors.home_sort_order?.message}
                        />
                    )}
                />
            )}

            <Controller
                name="is_published"
                control={control}
                render={({ field }) => (
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={field.value ?? true}
                            onChange={(event) => field.onChange(event.target.checked)}
                        />
                        <span>Published</span>
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

export default PortfolioItemForm;
