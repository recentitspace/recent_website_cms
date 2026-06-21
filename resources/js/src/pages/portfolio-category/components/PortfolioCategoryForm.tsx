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
import { portfolioCategoryApi } from "../../../services/portfolioCategory";
import { IPortfolioCategory } from "../../../types";

const categorySchema = z.object({
    name: z.string().min(1, "Name is required"),
    slug: z.string().optional(),
    sort_order: z.coerce.number().min(0).optional(),
    is_active: z.boolean().optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface PortfolioCategoryFormProps {
    categoryToEdit?: IPortfolioCategory | null;
    onClose: () => void;
}

const PortfolioCategoryForm: React.FC<PortfolioCategoryFormProps> = ({
    categoryToEdit,
    onClose,
}) => {
    const queryClient = useQueryClient();
    const simpleMode = useSimpleFormMode();
    const [generalError, setGeneralError] = useState<string | null>(null);
    const isEditMode = Boolean(categoryToEdit);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CategoryFormData>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: "",
            slug: "",
            sort_order: 0,
            is_active: true,
        },
    });

    useEffect(() => {
        if (categoryToEdit) {
            reset({
                name: categoryToEdit.name,
                slug: categoryToEdit.slug,
                sort_order: categoryToEdit.sort_order,
                is_active: categoryToEdit.is_active,
            });
        }
    }, [categoryToEdit, reset]);

    const invalidate = () => {
        queryClient.invalidateQueries({ queryKey: ["Portfolio Category Table"] });
        queryClient.invalidateQueries({ queryKey: ["editor-portfolio-categories"] });
    };

    const createMutation = useMutation({
        mutationFn: (data: CategoryFormData) => portfolioCategoryApi.create(data),
        onSuccess: () => {
            invalidate();
            toast.success("Category saved");
            onClose();
        },
        onError: (error: any) => {
            setGeneralError(error?.message || "Could not save category");
        },
    });

    const updateMutation = useMutation({
        mutationFn: (data: CategoryFormData) =>
            portfolioCategoryApi.update(categoryToEdit!.id, data),
        onSuccess: () => {
            invalidate();
            queryClient.invalidateQueries({
                queryKey: ["portfolio-category", categoryToEdit?.id],
            });
            toast.success("Category updated");
            onClose();
        },
        onError: (error: any) => {
            setGeneralError(error?.message || "Could not update category");
        },
    });

    const onSubmit = (data: CategoryFormData) => {
        setGeneralError(null);
        const payload = {
            ...data,
            slug: data.slug?.trim() || undefined,
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
                title="Category name"
                description="Groups related projects on your portfolio page."
            >
                <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                        <FormInput
                            label="Category name"
                            hint='e.g. "Web Apps" or "Branding"'
                            value={field.value || ""}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            error={errors.name?.message}
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
            </FormAdvancedFields>

            <FormFooter onCancel={onClose} isSubmitting={isSubmitting} isEditMode={isEditMode} />
        </form>
    );
};

export default PortfolioCategoryForm;
