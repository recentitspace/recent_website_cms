import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import ActionButton from "../../../components/ActionButton";
import Alert from "../../../components/Alert";
import MediaSelect from "../../../components/media/MediaSelect";
import FormInput from "../../../components/form/FormInput";
import FormTextarea from "../../../components/form/FormTextarea";
import { serviceCategoryApi } from "../../../services/serviceCategory";
import { IMedia, IServiceCategory } from "../../../types";

const processStepSchema = z.object({
    title: z.string().min(1, "Step title is required"),
    description: z.string().optional(),
});

const categorySchema = z.object({
    title: z.string().min(1, "Title is required"),
    slug: z.string().optional(),
    icon_id: z.number().nullable().optional(),
    hero_image_id: z.number().nullable().optional(),
    hero_title: z.string().optional(),
    description: z.string().optional(),
    listing_subtitle: z.string().optional(),
    page_path: z.string().min(1, "Page path is required"),
    cta_text: z.string().optional(),
    process_title: z.string().optional(),
    process_subtitle: z.string().optional(),
    process_steps: z.array(processStepSchema).optional(),
    sort_order: z.coerce.number().min(0).optional(),
    is_active: z.boolean().optional(),
    show_on_home: z.boolean().optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface ServiceCategoryFormProps {
    categoryToEdit?: IServiceCategory | null;
    onClose: () => void;
}

const ServiceCategoryForm: React.FC<ServiceCategoryFormProps> = ({
    categoryToEdit,
    onClose,
}) => {
    const queryClient = useQueryClient();
    const [generalError, setGeneralError] = useState<string | null>(null);
    const [selectedIcon, setSelectedIcon] = useState<IMedia | null>(null);
    const [selectedHeroImage, setSelectedHeroImage] = useState<IMedia | null>(null);
    const isEditMode = Boolean(categoryToEdit);

    const { data: fullCategory } = useQuery({
        queryKey: ["service-category", categoryToEdit?.id],
        queryFn: () => serviceCategoryApi.getById(categoryToEdit!.id),
        enabled: Boolean(categoryToEdit?.id),
    });

    const editCategory = fullCategory || categoryToEdit;

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CategoryFormData>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            title: "",
            slug: "",
            icon_id: null,
            hero_image_id: null,
            hero_title: "",
            description: "",
            listing_subtitle: "",
            page_path: "",
            cta_text: "Get started",
            process_title: "",
            process_subtitle: "",
            process_steps: [],
            sort_order: 0,
            is_active: true,
            show_on_home: true,
        },
    });

    const { fields: processStepFields, append: appendProcessStep, remove: removeProcessStep } =
        useFieldArray({
            control,
            name: "process_steps",
        });

    useEffect(() => {
        if (editCategory) {
            reset({
                title: editCategory.title,
                slug: editCategory.slug,
                icon_id: editCategory.icon_id || null,
                hero_image_id: editCategory.hero_image_id || null,
                hero_title: editCategory.hero_title || "",
                description: editCategory.description || "",
                listing_subtitle: editCategory.listing_subtitle || "",
                page_path: editCategory.page_path,
                cta_text: editCategory.cta_text || "Get started",
                process_title: editCategory.process_title || "",
                process_subtitle: editCategory.process_subtitle || "",
                process_steps: editCategory.process_steps?.length
                    ? editCategory.process_steps.map((step) => ({
                          title: step.title,
                          description: step.description || "",
                      }))
                    : [],
                sort_order: editCategory.sort_order,
                is_active: editCategory.is_active,
                show_on_home: editCategory.show_on_home,
            });
            setSelectedIcon(editCategory.icon || null);
            setSelectedHeroImage(editCategory.hero_image || null);
        }
    }, [editCategory, reset]);

    const buildPayload = (data: CategoryFormData) => ({
        ...data,
        slug: data.slug?.trim() || undefined,
        hero_title: data.hero_title?.trim() || null,
        description: data.description?.trim() || null,
        listing_subtitle: data.listing_subtitle?.trim() || null,
        cta_text: data.cta_text?.trim() || "Get started",
        process_title: data.process_title?.trim() || null,
        process_subtitle: data.process_subtitle?.trim() || null,
        process_steps: data.process_steps?.length
            ? data.process_steps.map((step) => ({
                  title: step.title.trim(),
                  description: step.description?.trim() || null,
              }))
            : [],
        icon_id: data.icon_id || null,
        hero_image_id: data.hero_image_id || null,
    });

    const createMutation = useMutation({
        mutationFn: (data: CategoryFormData) => serviceCategoryApi.create(buildPayload(data)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["Service Category Table"] });
            queryClient.invalidateQueries({ queryKey: ["Service Categories Select"] });
            toast.success("Service category created successfully");
            onClose();
        },
        onError: (error: any) => {
            setGeneralError(error?.message || "Failed to create service category");
        },
    });

    const updateMutation = useMutation({
        mutationFn: (data: CategoryFormData) =>
            serviceCategoryApi.update(editCategory!.id, buildPayload(data)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["Service Category Table"] });
            queryClient.invalidateQueries({ queryKey: ["Service Categories Select"] });
            queryClient.invalidateQueries({
                queryKey: ["service-category", editCategory?.id],
            });
            toast.success("Service category updated successfully");
            onClose();
        },
        onError: (error: any) => {
            setGeneralError(error?.message || "Failed to update service category");
        },
    });

    const onSubmit = (data: CategoryFormData) => {
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
                name="icon_id"
                control={control}
                render={({ field }) => (
                    <MediaSelect
                        label="Icon"
                        value={field.value}
                        selectedMedia={selectedIcon}
                        onChange={(mediaId, media) => {
                            field.onChange(mediaId);
                            setSelectedIcon(media || null);
                        }}
                    />
                )}
            />

            <Controller
                name="hero_image_id"
                control={control}
                render={({ field }) => (
                    <MediaSelect
                        label="Hero Image"
                        value={field.value}
                        selectedMedia={selectedHeroImage}
                        onChange={(mediaId, media) => {
                            field.onChange(mediaId);
                            setSelectedHeroImage(media || null);
                        }}
                    />
                )}
            />

            <Controller
                name="hero_title"
                control={control}
                render={({ field }) => (
                    <FormInput
                        label="Hero Title"
                        value={field.value || ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        error={errors.hero_title?.message}
                    />
                )}
            />

            <Controller
                name="description"
                control={control}
                render={({ field }) => (
                    <FormTextarea
                        label="Description"
                        value={field.value || ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        error={errors.description?.message}
                        rows={4}
                    />
                )}
            />

            <Controller
                name="listing_subtitle"
                control={control}
                render={({ field }) => (
                    <FormInput
                        label="Listing Subtitle"
                        value={field.value || ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        error={errors.listing_subtitle?.message}
                    />
                )}
            />

            <Controller
                name="page_path"
                control={control}
                render={({ field }) => (
                    <FormInput
                        label="Page Path"
                        value={field.value || ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        error={errors.page_path?.message}
                        placeholder="/services/business-automation"
                    />
                )}
            />

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
                name="process_title"
                control={control}
                render={({ field }) => (
                    <FormInput
                        label="Process Title"
                        value={field.value || ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        error={errors.process_title?.message}
                    />
                )}
            />

            <Controller
                name="process_subtitle"
                control={control}
                render={({ field }) => (
                    <FormInput
                        label="Process Subtitle"
                        value={field.value || ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        error={errors.process_subtitle?.message}
                    />
                )}
            />

            <div>
                <div className="mb-2 flex items-center justify-between">
                    <label className="font-medium">Process Steps</label>
                    <button
                        type="button"
                        className="btn btn-sm btn-outline-primary gap-1"
                        onClick={() => appendProcessStep({ title: "", description: "" })}
                    >
                        <Plus size={14} />
                        Add Step
                    </button>
                </div>

                {processStepFields.length === 0 && (
                    <p className="text-sm text-gray-500">No process steps added yet.</p>
                )}

                <div className="space-y-3">
                    {processStepFields.map((field, index) => (
                        <div
                            key={field.id}
                            className="rounded border border-gray-200 p-3 dark:border-gray-700"
                        >
                            <div className="mb-2 flex items-start justify-between gap-2">
                                <span className="text-sm font-medium text-gray-500">
                                    Step {index + 1}
                                </span>
                                <button
                                    type="button"
                                    className="text-danger hover:opacity-80"
                                    onClick={() => removeProcessStep(index)}
                                    aria-label={`Remove step ${index + 1}`}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <Controller
                                name={`process_steps.${index}.title`}
                                control={control}
                                render={({ field: titleField }) => (
                                    <FormInput
                                        label="Title"
                                        value={titleField.value || ""}
                                        onChange={titleField.onChange}
                                        onBlur={titleField.onBlur}
                                        error={errors.process_steps?.[index]?.title?.message}
                                    />
                                )}
                            />

                            <Controller
                                name={`process_steps.${index}.description`}
                                control={control}
                                render={({ field: descriptionField }) => (
                                    <FormTextarea
                                        label="Description"
                                        value={descriptionField.value || ""}
                                        onChange={descriptionField.onChange}
                                        onBlur={descriptionField.onBlur}
                                        error={errors.process_steps?.[index]?.description?.message}
                                        rows={3}
                                    />
                                )}
                            />
                        </div>
                    ))}
                </div>
            </div>

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

            <Controller
                name="show_on_home"
                control={control}
                render={({ field }) => (
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={field.value ?? true}
                            onChange={(event) => field.onChange(event.target.checked)}
                        />
                        <span>Show on Home</span>
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

export default ServiceCategoryForm;
