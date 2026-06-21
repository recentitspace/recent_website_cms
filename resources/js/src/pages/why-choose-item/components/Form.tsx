import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import Alert from "../../../components/Alert";
import MediaSelect from "../../../components/media/MediaSelect";
import FormAdvancedFields from "../../../components/form/FormAdvancedFields";
import FormFooter from "../../../components/form/FormFooter";
import FormInput from "../../../components/form/FormInput";
import FormSection from "../../../components/form/FormSection";
import FormTextarea from "../../../components/form/FormTextarea";
import FormToggle from "../../../components/form/FormToggle";
import { whyChooseItemApi } from "../../../services/whyChooseItem";
import { IMedia, IWhyChooseItem } from "../../../types";

const whyChooseItemSchema = z.object({
    title: z.string().min(1, "Title is required"),
    body: z.string().optional(),
    icon_id: z.number().nullable().optional(),
    sort_order: z.coerce.number().min(0).optional(),
    is_active: z.boolean().optional(),
});

type WhyChooseItemFormData = z.infer<typeof whyChooseItemSchema>;

interface FormProps {
    itemToEdit?: IWhyChooseItem | null;
    onClose: () => void;
}

const Form: React.FC<FormProps> = ({ itemToEdit, onClose }) => {
    const queryClient = useQueryClient();
    const [generalError, setGeneralError] = useState<string | null>(null);
    const [selectedIcon, setSelectedIcon] = useState<IMedia | null>(null);
    const isEditMode = Boolean(itemToEdit);

    const { data: fullItem } = useQuery({
        queryKey: ["why-choose-item", itemToEdit?.id],
        queryFn: () => whyChooseItemApi.getById(itemToEdit!.id),
        enabled: Boolean(itemToEdit?.id),
    });

    const editItem = fullItem || itemToEdit;

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<WhyChooseItemFormData>({
        resolver: zodResolver(whyChooseItemSchema),
        defaultValues: {
            title: "",
            body: "",
            icon_id: null,
            sort_order: 0,
            is_active: true,
        },
    });

    useEffect(() => {
        if (editItem) {
            reset({
                title: editItem.title,
                body: editItem.body || "",
                icon_id: editItem.icon_id || null,
                sort_order: editItem.sort_order,
                is_active: editItem.is_active,
            });
            setSelectedIcon(editItem.icon || null);
        }
    }, [editItem, reset]);

    const invalidate = () => {
        queryClient.invalidateQueries({ queryKey: ["Why Choose Item Table"] });
        queryClient.invalidateQueries({ queryKey: ["editor-why-choose-items"] });
    };

    const buildPayload = (data: WhyChooseItemFormData) => ({
        ...data,
        body: data.body?.trim() || null,
        icon_id: data.icon_id || null,
    });

    const createMutation = useMutation({
        mutationFn: (data: WhyChooseItemFormData) => whyChooseItemApi.create(buildPayload(data)),
        onSuccess: () => {
            invalidate();
            toast.success("Why choose item saved");
            onClose();
        },
        onError: (error: any) => {
            setGeneralError(error?.message || "Could not save why choose item");
        },
    });

    const updateMutation = useMutation({
        mutationFn: (data: WhyChooseItemFormData) =>
            whyChooseItemApi.update(editItem!.id, buildPayload(data)),
        onSuccess: () => {
            invalidate();
            queryClient.invalidateQueries({ queryKey: ["why-choose-item", editItem?.id] });
            toast.success("Why choose item updated");
            onClose();
        },
        onError: (error: any) => {
            setGeneralError(error?.message || "Could not update why choose item");
        },
    });

    const onSubmit = (data: WhyChooseItemFormData) => {
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
                description="Title and description for this why-choose-us item."
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
                            id="why-choose-item-body"
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

            <FormSection title="Icon" description="Small icon shown with this item (optional).">
                <Controller
                    name="icon_id"
                    control={control}
                    render={({ field }) => (
                        <MediaSelect
                            label="Icon image"
                            value={field.value}
                            selectedMedia={selectedIcon}
                            onChange={(mediaId, media) => {
                                field.onChange(mediaId);
                                setSelectedIcon(media || null);
                            }}
                        />
                    )}
                />
            </FormSection>

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
