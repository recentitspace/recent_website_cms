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
import FormSelect from "../../../components/form/FormSelect";
import { serviceCategoryApi } from "../../../services/serviceCategory";
import { serviceItemApi } from "../../../services/serviceItem";
import { IMedia, IServiceItem } from "../../../types";

const itemSchema = z.object({
    service_category_id: z.coerce.number().min(1, "Category is required"),
    title: z.string().min(1, "Title is required"),
    slug: z.string().optional(),
    icon_id: z.number().nullable().optional(),
    page_path: z.string().min(1, "Page path is required"),
    highlights: z.array(z.string()).optional(),
    sort_order: z.coerce.number().min(0).optional(),
    is_active: z.boolean().optional(),
    show_on_home: z.boolean().optional(),
});

type ItemFormData = z.infer<typeof itemSchema>;

interface ServiceItemFormProps {
    itemToEdit?: IServiceItem | null;
    onClose: () => void;
}

const ServiceItemForm: React.FC<ServiceItemFormProps> = ({ itemToEdit, onClose }) => {
    const queryClient = useQueryClient();
    const [generalError, setGeneralError] = useState<string | null>(null);
    const [selectedIcon, setSelectedIcon] = useState<IMedia | null>(null);
    const isEditMode = Boolean(itemToEdit);

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
            highlights: [],
            sort_order: 0,
            is_active: true,
            show_on_home: true,
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "highlights",
    });

    useEffect(() => {
        if (editItem) {
            reset({
                service_category_id: editItem.service_category_id,
                title: editItem.title,
                slug: editItem.slug,
                icon_id: editItem.icon_id || null,
                page_path: editItem.page_path,
                highlights: editItem.highlights?.length ? editItem.highlights : [],
                sort_order: editItem.sort_order,
                is_active: editItem.is_active,
                show_on_home: editItem.show_on_home,
            });
            setSelectedIcon(editItem.icon || null);
        }
    }, [editItem, reset]);

    const createMutation = useMutation({
        mutationFn: (data: ItemFormData) =>
            serviceItemApi.create({
                ...data,
                slug: data.slug?.trim() || undefined,
                icon_id: data.icon_id || null,
                highlights: data.highlights?.filter((h) => h.trim()) || [],
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["Service Item Table"] });
            toast.success("Service item created successfully");
            onClose();
        },
        onError: (error: any) => {
            setGeneralError(error?.message || "Failed to create service item");
        },
    });

    const updateMutation = useMutation({
        mutationFn: (data: ItemFormData) =>
            serviceItemApi.update(editItem!.id, {
                ...data,
                slug: data.slug?.trim() || undefined,
                icon_id: data.icon_id || null,
                highlights: data.highlights?.filter((h) => h.trim()) || [],
            }),
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

export default ServiceItemForm;
