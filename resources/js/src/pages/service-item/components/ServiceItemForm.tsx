import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
    Control,
    Controller,
    FieldErrors,
    useFieldArray,
    useForm,
} from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import FormFooter from "../../../components/form/FormFooter";
import Alert from "../../../components/Alert";
import MediaSelect from "../../../components/media/MediaSelect";
import FormInput from "../../../components/form/FormInput";
import FormSelect from "../../../components/form/FormSelect";
import FormTextarea from "../../../components/form/FormTextarea";
import { serviceCategoryApi } from "../../../services/serviceCategory";
import { serviceItemApi } from "../../../services/serviceItem";
import { IMedia, IServiceItem } from "../../../types";

const processStepSchema = z.object({
    title: z.string().min(1, "Step title is required"),
    description: z.string().optional(),
    tasks: z.array(z.string()).optional(),
});

const itemSchema = z.object({
    service_category_id: z.coerce.number().min(1, "Category is required"),
    title: z.string().min(1, "Title is required"),
    slug: z.string().optional(),
    icon_id: z.number().nullable().optional(),
    page_path: z.string().min(1, "Page path is required"),
    detail_hero_title: z.string().optional(),
    detail_hero_description: z.string().optional(),
    hero_image_id: z.number().nullable().optional(),
    highlights: z.array(z.string()).optional(),
    process_title: z.string().optional(),
    process_subtitle: z.string().optional(),
    process_steps: z.array(processStepSchema).optional(),
    sort_order: z.coerce.number().min(0).optional(),
    is_active: z.boolean().optional(),
    show_on_home: z.boolean().optional(),
});

type ItemFormData = z.infer<typeof itemSchema>;

interface ProcessStepTasksProps {
    control: Control<ItemFormData>;
    stepIndex: number;
    errors: FieldErrors<ItemFormData>;
}

const ProcessStepTasks: React.FC<ProcessStepTasksProps> = ({
    control,
    stepIndex,
    errors,
}) => {
    const { fields, append, remove } = useFieldArray({
        control,
        name: `process_steps.${stepIndex}.tasks`,
    });

    return (
        <div className="mt-3">
            <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium">Tasks</label>
                <button
                    type="button"
                    className="btn btn-sm btn-outline-primary gap-1"
                    onClick={() => append("")}
                >
                    <Plus size={14} />
                    Add Task
                </button>
            </div>
            <div className="space-y-2">
                {fields.map((field, taskIndex) => (
                    <div key={field.id} className="flex items-start gap-2">
                        <Controller
                            name={`process_steps.${stepIndex}.tasks.${taskIndex}`}
                            control={control}
                            render={({ field: taskField }) => (
                                <FormInput
                                    label=""
                                    value={taskField.value || ""}
                                    onChange={taskField.onChange}
                                    onBlur={taskField.onBlur}
                                    placeholder="Task"
                                />
                            )}
                        />
                        <button
                            type="button"
                            className="btn btn-sm btn-outline-danger mt-1"
                            onClick={() => remove(taskIndex)}
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                ))}
            </div>
            {errors.process_steps?.[stepIndex]?.tasks && (
                <p className="mt-1 text-sm text-danger">
                    {errors.process_steps[stepIndex]?.tasks?.message}
                </p>
            )}
        </div>
    );
};

interface ServiceItemFormProps {
    itemToEdit?: IServiceItem | null;
    defaultServiceCategoryId?: number | null;
    onClose: () => void;
}

const ServiceItemForm: React.FC<ServiceItemFormProps> = ({
    itemToEdit,
    defaultServiceCategoryId,
    onClose,
}) => {
    const queryClient = useQueryClient();
    const [generalError, setGeneralError] = useState<string | null>(null);
    const [selectedIcon, setSelectedIcon] = useState<IMedia | null>(null);
    const [selectedHeroImage, setSelectedHeroImage] = useState<IMedia | null>(null);
    const isEditMode = Boolean(itemToEdit);
    const hideCategorySelect = Boolean(defaultServiceCategoryId) || isEditMode;

    const { data: fullItem } = useQuery({
        queryKey: ["service-item", itemToEdit?.id],
        queryFn: () => serviceItemApi.getById(itemToEdit!.id),
        enabled: Boolean(itemToEdit?.id),
    });

    const editItem = fullItem || itemToEdit;

    const { data: categoriesResponse } = useQuery({
        queryKey: ["Service Categories Select"],
        queryFn: () =>
            serviceCategoryApi.getAll({
                per_page: 100,
                sort_by: "sort_order",
                sort_direction: "asc",
            }),
    });

    const categoryOptions =
        categoriesResponse?.data?.map((category) => ({
            value: String(category.id),
            label: category.title,
        })) || [];

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ItemFormData>({
        resolver: zodResolver(itemSchema),
        defaultValues: {
            service_category_id: 0,
            title: "",
            slug: "",
            icon_id: null,
            page_path: "",
            detail_hero_title: "",
            detail_hero_description: "",
            hero_image_id: null,
            highlights: [],
            process_title: "",
            process_subtitle: "",
            process_steps: [],
            sort_order: 0,
            is_active: true,
            show_on_home: true,
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "highlights",
    });

    const {
        fields: processStepFields,
        append: appendProcessStep,
        remove: removeProcessStep,
    } = useFieldArray({
        control,
        name: "process_steps",
    });

    const buildPayload = (data: ItemFormData) => ({
        ...data,
        slug: data.slug?.trim() || undefined,
        icon_id: data.icon_id || null,
        hero_image_id: data.hero_image_id || null,
        detail_hero_title: data.detail_hero_title?.trim() || null,
        detail_hero_description: data.detail_hero_description?.trim() || null,
        highlights: data.highlights?.filter((h) => h.trim()) || [],
        process_title: data.process_title?.trim() || null,
        process_subtitle: data.process_subtitle?.trim() || null,
        process_steps: data.process_steps?.length
            ? data.process_steps.map((step) => ({
                  title: step.title.trim(),
                  description: step.description?.trim() || null,
                  tasks: step.tasks?.filter((task) => task.trim()) || [],
              }))
            : [],
    });

    useEffect(() => {
        if (editItem) {
            reset({
                service_category_id: editItem.service_category_id,
                title: editItem.title,
                slug: editItem.slug,
                icon_id: editItem.icon_id || null,
                page_path: editItem.page_path,
                detail_hero_title: editItem.detail_hero_title || "",
                detail_hero_description: editItem.detail_hero_description || "",
                hero_image_id: editItem.hero_image_id || null,
                highlights: editItem.highlights?.length ? editItem.highlights : [],
                process_title: editItem.process_title || "",
                process_subtitle: editItem.process_subtitle || "",
                process_steps: editItem.process_steps?.length
                    ? editItem.process_steps.map((step) => ({
                          title: step.title,
                          description: step.description || "",
                          tasks: step.tasks?.length ? step.tasks : [],
                      }))
                    : [],
                sort_order: editItem.sort_order,
                is_active: editItem.is_active,
                show_on_home: editItem.show_on_home,
            });
            setSelectedIcon(editItem.icon || null);
            setSelectedHeroImage(editItem.hero_image || null);
            return;
        }

        if (defaultServiceCategoryId) {
            reset({
                service_category_id: defaultServiceCategoryId,
                title: "",
                slug: "",
                icon_id: null,
                page_path: "",
                detail_hero_title: "",
                detail_hero_description: "",
                hero_image_id: null,
                highlights: [],
                process_title: "",
                process_subtitle: "",
                process_steps: [],
                sort_order: 0,
                is_active: true,
                show_on_home: true,
            });
        }
    }, [editItem, defaultServiceCategoryId, reset]);

    const createMutation = useMutation({
        mutationFn: (data: ItemFormData) => serviceItemApi.create(buildPayload(data)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["Service Item Table"] });
            if (defaultServiceCategoryId) {
                queryClient.invalidateQueries({
                    queryKey: ["editor-service-items", defaultServiceCategoryId],
                });
            }
            toast.success("Service item created successfully");
            onClose();
        },
        onError: (error: any) => {
            setGeneralError(error?.message || "Failed to create service item");
        },
    });

    const updateMutation = useMutation({
        mutationFn: (data: ItemFormData) =>
            serviceItemApi.update(editItem!.id, buildPayload(data)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["Service Item Table"] });
            queryClient.invalidateQueries({ queryKey: ["service-item", editItem?.id] });
            toast.success("Service item updated successfully");
            onClose();
        },
        onError: (error: any) => {
            setGeneralError(error?.message || "Failed to update service item");
        },
    });

    const onSubmit = (data: ItemFormData) => {
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

            {!hideCategorySelect && (
                <Controller
                    name="service_category_id"
                    control={control}
                    render={({ field }) => (
                        <FormSelect
                            label="Category"
                            value={String(field.value || "")}
                            onChange={(value) => field.onChange(Number(value))}
                            options={categoryOptions}
                            error={errors.service_category_id?.message}
                        />
                    )}
                />
            )}

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
                        label="Icon (optional)"
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
                name="page_path"
                control={control}
                render={({ field }) => (
                    <FormInput
                        label="Page Path"
                        value={field.value || ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        error={errors.page_path?.message}
                        placeholder="/services/business-automation/software-development"
                    />
                )}
            />

            <Controller
                name="detail_hero_title"
                control={control}
                render={({ field }) => (
                    <FormInput
                        label="Detail Hero Title"
                        value={field.value || ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        error={errors.detail_hero_title?.message}
                    />
                )}
            />

            <Controller
                name="detail_hero_description"
                control={control}
                render={({ field }) => (
                    <FormTextarea
                        label="Detail Hero Description"
                        value={field.value || ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        error={errors.detail_hero_description?.message}
                        rows={4}
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

            <div>
                <div className="mb-2 flex items-center justify-between">
                    <label className="font-medium">Highlights</label>
                    <button
                        type="button"
                        className="btn btn-sm btn-outline-primary gap-1"
                        onClick={() => append("")}
                    >
                        <Plus size={14} />
                        Add
                    </button>
                </div>
                <div className="space-y-2">
                    {fields.map((field, index) => (
                        <div key={field.id} className="flex items-start gap-2">
                            <Controller
                                name={`highlights.${index}`}
                                control={control}
                                render={({ field: highlightField }) => (
                                    <FormInput
                                        label=""
                                        value={highlightField.value || ""}
                                        onChange={highlightField.onChange}
                                        onBlur={highlightField.onBlur}
                                        placeholder="Feature bullet point"
                                    />
                                )}
                            />
                            <button
                                type="button"
                                className="btn btn-sm btn-outline-danger mt-1"
                                onClick={() => remove(index)}
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

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
                        onClick={() =>
                            appendProcessStep({ title: "", description: "", tasks: [] })
                        }
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
                                        error={
                                            errors.process_steps?.[index]?.description?.message
                                        }
                                        rows={3}
                                    />
                                )}
                            />

                            <ProcessStepTasks
                                control={control}
                                stepIndex={index}
                                errors={errors}
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
                        <span>Show on Home (under parent category)</span>
                    </label>
                )}
            />

            <FormFooter onCancel={onClose} isSubmitting={isSubmitting} isEditMode={isEditMode} />
        </form>
    );
};

export default ServiceItemForm;
