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
import FormTextarea from "../../../components/form/FormTextarea";
import { pageBlockApi } from "../../../services/pageBlock";
import { pageBlockItemApi } from "../../../services/pageBlockItem";
import { IMedia, IPageBlockItem } from "../../../types";

const itemSchema = z.object({
    page_block_id: z.coerce.number().min(1, "Block is required"),
    title: z.string().min(1, "Title is required"),
    body: z.string().optional(),
    image_id: z.number().nullable().optional(),
    icon_id: z.number().nullable().optional(),
    bullets: z.array(z.string()).optional(),
    sort_order: z.coerce.number().min(0).optional(),
    is_active: z.boolean().optional(),
});

type ItemFormData = z.infer<typeof itemSchema>;

interface PageBlockItemFormProps {
    itemToEdit?: IPageBlockItem | null;
    onClose: () => void;
}

const PageBlockItemForm: React.FC<PageBlockItemFormProps> = ({ itemToEdit, onClose }) => {
    const queryClient = useQueryClient();
    const [generalError, setGeneralError] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<IMedia | null>(null);
    const [selectedIcon, setSelectedIcon] = useState<IMedia | null>(null);
    const isEditMode = Boolean(itemToEdit);

    const { data: fullItem } = useQuery({
        queryKey: ["page-block-item", itemToEdit?.id],
        queryFn: () => pageBlockItemApi.getById(itemToEdit!.id),
        enabled: Boolean(itemToEdit?.id),
    });

    const editItem = fullItem || itemToEdit;

    const { data: blocksResponse } = useQuery({
        queryKey: ["Page Blocks Select"],
        queryFn: () =>
            pageBlockApi.getAll({
                per_page: 100,
                sort_by: "sort_order",
                sort_direction: "asc",
            }),
    });

    const blockOptions =
        blocksResponse?.data?.map((block) => ({
            value: String(block.id),
            label: `${block.page} / ${block.key}${block.title ? ` — ${block.title}` : ""}`,
        })) || [];

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ItemFormData>({
        resolver: zodResolver(itemSchema),
        defaultValues: {
            page_block_id: 0,
            title: "",
            body: "",
            image_id: null,
            icon_id: null,
            bullets: [],
            sort_order: 0,
            is_active: true,
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "bullets",
    });

    useEffect(() => {
        if (editItem) {
            reset({
                page_block_id: editItem.page_block_id,
                title: editItem.title,
                body: editItem.body || "",
                image_id: editItem.image_id || null,
                icon_id: editItem.icon_id || null,
                bullets: editItem.bullets?.length ? editItem.bullets : [],
                sort_order: editItem.sort_order,
                is_active: editItem.is_active,
            });
            setSelectedImage(editItem.image || null);
            setSelectedIcon(editItem.icon || null);
        }
    }, [editItem, reset]);

    const createMutation = useMutation({
        mutationFn: (data: ItemFormData) =>
            pageBlockItemApi.create({
                ...data,
                body: data.body?.trim() || null,
                image_id: data.image_id || null,
                icon_id: data.icon_id || null,
                bullets: data.bullets?.filter((b) => b.trim()) || [],
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["Page Block Item Table"] });
            toast.success("Page block item created successfully");
            onClose();
        },
        onError: (error: any) => {
            setGeneralError(error?.message || "Failed to create page block item");
        },
    });

    const updateMutation = useMutation({
        mutationFn: (data: ItemFormData) =>
            pageBlockItemApi.update(editItem!.id, {
                ...data,
                body: data.body?.trim() || null,
                image_id: data.image_id || null,
                icon_id: data.icon_id || null,
                bullets: data.bullets?.filter((b) => b.trim()) || [],
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["Page Block Item Table"] });
            queryClient.invalidateQueries({ queryKey: ["page-block-item", editItem?.id] });
            toast.success("Page block item updated successfully");
            onClose();
        },
        onError: (error: any) => {
            setGeneralError(error?.message || "Failed to update page block item");
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
                name="page_block_id"
                control={control}
                render={({ field }) => (
                    <FormSelect
                        label="Page Block"
                        value={String(field.value || "")}
                        onChange={(value) => field.onChange(Number(value))}
                        options={blockOptions}
                        error={errors.page_block_id?.message}
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
                name="body"
                control={control}
                render={({ field }) => (
                    <FormTextarea
                        label="Body"
                        value={field.value || ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        error={errors.body?.message}
                        rows={3}
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

            <div>
                <div className="mb-2 flex items-center justify-between">
                    <label className="font-medium">Bullets</label>
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
                                name={`bullets.${index}`}
                                control={control}
                                render={({ field: bulletField }) => (
                                    <FormInput
                                        label=""
                                        value={bulletField.value || ""}
                                        onChange={bulletField.onChange}
                                        onBlur={bulletField.onBlur}
                                        placeholder="Bullet point"
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

export default PageBlockItemForm;
