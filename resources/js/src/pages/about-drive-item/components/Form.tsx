import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import Alert from "../../../components/Alert";
import MediaSelect from "../../../components/media/MediaSelect";
import FormAdvancedFields from "../../../components/form/FormAdvancedFields";
import FormFieldList from "../../../components/form/FormFieldList";
import FormFooter from "../../../components/form/FormFooter";
import FormInput from "../../../components/form/FormInput";
import FormSection from "../../../components/form/FormSection";
import FormTextarea from "../../../components/form/FormTextarea";
import FormToggle from "../../../components/form/FormToggle";
import { aboutDriveItemApi } from "../../../services/aboutDriveItem";
import { IAboutDriveItem, IMedia } from "../../../types";

const aboutDriveItemSchema = z.object({
    title: z.string().min(1, "Title is required"),
    body: z.string().optional(),
    image_id: z.number().nullable().optional(),
    bullets: z.array(z.string()).optional(),
    sort_order: z.coerce.number().min(0).optional(),
    is_active: z.boolean().optional(),
});

type AboutDriveItemFormData = z.infer<typeof aboutDriveItemSchema>;

interface FormProps {
    itemToEdit?: IAboutDriveItem | null;
    onClose: () => void;
}

const Form: React.FC<FormProps> = ({ itemToEdit, onClose }) => {
    const queryClient = useQueryClient();
    const [generalError, setGeneralError] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<IMedia | null>(null);
    const isEditMode = Boolean(itemToEdit);

    const { data: fullItem } = useQuery({
        queryKey: ["about-drive-item", itemToEdit?.id],
        queryFn: () => aboutDriveItemApi.getById(itemToEdit!.id),
        enabled: Boolean(itemToEdit?.id),
    });

    const editItem = fullItem || itemToEdit;

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<AboutDriveItemFormData>({
        resolver: zodResolver(aboutDriveItemSchema),
        defaultValues: {
            title: "",
            body: "",
            image_id: null,
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
                title: editItem.title,
                body: editItem.body || "",
                image_id: editItem.image_id || null,
                bullets: editItem.bullets?.length ? editItem.bullets : [],
                sort_order: editItem.sort_order,
                is_active: editItem.is_active,
            });
            setSelectedImage(editItem.image || null);
        }
    }, [editItem, reset]);

    const invalidate = () => {
        queryClient.invalidateQueries({ queryKey: ["About Drive Item Table"] });
        queryClient.invalidateQueries({ queryKey: ["editor-about-drive-items"] });
    };

    const buildPayload = (data: AboutDriveItemFormData) => ({
        ...data,
        body: data.body?.trim() || null,
        image_id: data.image_id || null,
        bullets: data.bullets?.filter((b) => b.trim()) || [],
    });

    const createMutation = useMutation({
        mutationFn: (data: AboutDriveItemFormData) => aboutDriveItemApi.create(buildPayload(data)),
        onSuccess: () => {
            invalidate();
            toast.success("About drive item saved");
            onClose();
        },
        onError: (error: any) => {
            setGeneralError(error?.message || "Could not save about drive item");
        },
    });

    const updateMutation = useMutation({
        mutationFn: (data: AboutDriveItemFormData) =>
            aboutDriveItemApi.update(editItem!.id, buildPayload(data)),
        onSuccess: () => {
            invalidate();
            queryClient.invalidateQueries({ queryKey: ["about-drive-item", editItem?.id] });
            toast.success("About drive item updated");
            onClose();
        },
        onError: (error: any) => {
            setGeneralError(error?.message || "Could not update about drive item");
        },
    });

    const onSubmit = (data: AboutDriveItemFormData) => {
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

            <FormSection
                title="Card content"
                description="Title and text for this about drive item."
            >
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
                            id="about-drive-item-body"
                            label="Description"
                            value={field.value || ""}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            error={errors.body?.message}
                            rows={3}
                        />
                    )}
                />
            </FormSection>

            <FormSection title="Image" description="Optional image for this item.">
                <Controller
                    name="image_id"
                    control={control}
                    render={({ field }) => (
                        <MediaSelect
                            label="Card image"
                            value={field.value}
                            selectedMedia={selectedImage}
                            onChange={(mediaId, media) => {
                                field.onChange(mediaId);
                                setSelectedImage(media || null);
                            }}
                        />
                    )}
                />
            </FormSection>

            <FormFieldList
                label="Bullet points"
                description="Short list items shown under the description (optional)."
                addLabel="Add point"
                emptyMessage="No bullet points — click Add if you need a list."
                itemCount={fields.length}
                onAdd={() => append("")}
                onRemove={remove}
                renderItem={(index) => (
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
                )}
            />

            <FormAdvancedFields>
                <Controller
                    name="sort_order"
                    control={control}
                    render={({ field }) => (
                        <FormInput
                            label="Display order"
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
                        <FormToggle
                            label="Show on website"
                            checked={field.value ?? true}
                            onChange={field.onChange}
                        />
                    )}
                />
            </FormAdvancedFields>

            <FormFooter onCancel={onClose} isSubmitting={isSubmitting} isEditMode={isEditMode} />
        </form>
    );
};

export default Form;
