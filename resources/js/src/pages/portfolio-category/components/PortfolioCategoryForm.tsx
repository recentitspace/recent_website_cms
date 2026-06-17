import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import ActionButton from "../../../components/ActionButton";
import Alert from "../../../components/Alert";
import FormInput from "../../../components/form/FormInput";
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

    const createMutation = useMutation({
        mutationFn: (data: CategoryFormData) => portfolioCategoryApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["Portfolio Category Table"] });
            toast.success("Category created successfully");
            onClose();
        },
        onError: (error: any) => {
            setGeneralError(error?.message || "Failed to create category");
        },
    });

    const updateMutation = useMutation({
        mutationFn: (data: CategoryFormData) =>
            portfolioCategoryApi.update(categoryToEdit!.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["Portfolio Category Table"] });
            queryClient.invalidateQueries({
                queryKey: ["portfolio-category", categoryToEdit?.id],
            });
            toast.success("Category updated successfully");
            onClose();
        },
        onError: (error: any) => {
            setGeneralError(error?.message || "Failed to update category");
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

            <Controller
                name="name"
                control={control}
                render={({ field }) => (
                    <FormInput
                        label="Name"
                        value={field.value || ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        error={errors.name?.message}
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

export default PortfolioCategoryForm;
