import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import ActionButton from "../../../components/ActionButton";
import Alert from "../../../components/Alert";
import FormInput from "../../../components/form/FormInput";
import { pricingSectionApi } from "../../../services/pricingSection";
import { IPricingSection } from "../../../types";

const sectionSchema = z.object({
    title: z.string().min(1, "Title is required"),
    slug: z.string().optional(),
    subtitle: z.string().optional(),
    sort_order: z.coerce.number().min(0).optional(),
    is_active: z.boolean().optional(),
    show_on_home: z.boolean().optional(),
});

type SectionFormData = z.infer<typeof sectionSchema>;

interface PricingSectionFormProps {
    sectionToEdit?: IPricingSection | null;
    onClose: () => void;
}

const PricingSectionForm: React.FC<PricingSectionFormProps> = ({
    sectionToEdit,
    onClose,
}) => {
    const queryClient = useQueryClient();
    const [generalError, setGeneralError] = useState<string | null>(null);
    const isEditMode = Boolean(sectionToEdit);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<SectionFormData>({
        resolver: zodResolver(sectionSchema),
        defaultValues: {
            title: "",
            slug: "",
            subtitle: "",
            sort_order: 0,
            is_active: true,
            show_on_home: false,
        },
    });

    useEffect(() => {
        if (sectionToEdit) {
            reset({
                title: sectionToEdit.title,
                slug: sectionToEdit.slug,
                subtitle: sectionToEdit.subtitle || "",
                sort_order: sectionToEdit.sort_order,
                is_active: sectionToEdit.is_active,
                show_on_home: sectionToEdit.show_on_home,
            });
        }
    }, [sectionToEdit, reset]);

    const createMutation = useMutation({
        mutationFn: (data: SectionFormData) => pricingSectionApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["Pricing Section Table"] });
            queryClient.invalidateQueries({ queryKey: ["Pricing Sections Select"] });
            toast.success("Pricing section created successfully");
            onClose();
        },
        onError: (error: any) => {
            setGeneralError(error?.message || "Failed to create pricing section");
        },
    });

    const updateMutation = useMutation({
        mutationFn: (data: SectionFormData) =>
            pricingSectionApi.update(sectionToEdit!.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["Pricing Section Table"] });
            queryClient.invalidateQueries({ queryKey: ["Pricing Sections Select"] });
            queryClient.invalidateQueries({
                queryKey: ["pricing-section", sectionToEdit?.id],
            });
            toast.success("Pricing section updated successfully");
            onClose();
        },
        onError: (error: any) => {
            setGeneralError(error?.message || "Failed to update pricing section");
        },
    });

    const onSubmit = (data: SectionFormData) => {
        setGeneralError(null);
        const payload = {
            ...data,
            slug: data.slug?.trim() || undefined,
            subtitle: data.subtitle?.trim() || null,
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
                            checked={field.value ?? false}
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

export default PricingSectionForm;
