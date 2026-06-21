import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import Alert from "../../../components/Alert";
import FormAdvancedFields from "../../../components/form/FormAdvancedFields";
import FormFooter from "../../../components/form/FormFooter";
import FormInput from "../../../components/form/FormInput";
import FormSection from "../../../components/form/FormSection";
import FormToggle from "../../../components/form/FormToggle";
import { useSimpleFormMode } from "../../../hooks/useSimpleFormMode";
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
    const simpleMode = useSimpleFormMode();
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

    const invalidate = () => {
        queryClient.invalidateQueries({ queryKey: ["Pricing Section Table"] });
        queryClient.invalidateQueries({ queryKey: ["Pricing Sections Select"] });
        queryClient.invalidateQueries({ queryKey: ["editor-pricing-sections"] });
    };

    const createMutation = useMutation({
        mutationFn: (data: SectionFormData) => pricingSectionApi.create(data),
        onSuccess: () => {
            invalidate();
            toast.success("Pricing category saved");
            onClose();
        },
        onError: (error: any) => {
            setGeneralError(error?.message || "Could not save category");
        },
    });

    const updateMutation = useMutation({
        mutationFn: (data: SectionFormData) =>
            pricingSectionApi.update(sectionToEdit!.id, data),
        onSuccess: () => {
            invalidate();
            queryClient.invalidateQueries({
                queryKey: ["pricing-section", sectionToEdit?.id],
            });
            toast.success("Pricing category updated");
            onClose();
        },
        onError: (error: any) => {
            setGeneralError(error?.message || "Could not update category");
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

            <FormSection
                title="Category details"
                description="A group of pricing plans — for example “Web Design” or “Hosting”."
            >
                <Controller
                    name="title"
                    control={control}
                    render={({ field }) => (
                        <FormInput
                            label="Category name"
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
                            label="Short description"
                            hint="Shown under the category title on the pricing page"
                            value={field.value || ""}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            error={errors.subtitle?.message}
                        />
                    )}
                />
            </FormSection>

            <FormAdvancedFields>
                {!simpleMode && (
                    <Controller
                        name="slug"
                        control={control}
                        render={({ field }) => (
                            <FormInput
                                label="URL slug"
                                value={field.value || ""}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                error={errors.slug?.message}
                            />
                        )}
                    />
                )}
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
                <Controller
                    name="show_on_home"
                    control={control}
                    render={({ field }) => (
                        <FormToggle
                            label="Show on home page"
                            checked={field.value ?? false}
                            onChange={field.onChange}
                        />
                    )}
                />
            </FormAdvancedFields>

            <FormFooter onCancel={onClose} isSubmitting={isSubmitting} isEditMode={isEditMode} />
        </form>
    );
};

export default PricingSectionForm;
