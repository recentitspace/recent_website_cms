import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { domainExtensionApi } from "../../../services/domainExtension";
import { IDomainExtension } from "../../../types";

const extensionSchema = z.object({
    extension: z.string().min(1, "Extension is required"),
    price: z.string().min(1, "Price is required"),
    period: z.string().optional(),
    badge: z.string().optional(),
    sort_order: z.coerce.number().min(0).optional(),
    is_active: z.boolean().optional(),
});

type ExtensionFormData = z.infer<typeof extensionSchema>;

interface DomainExtensionFormProps {
    extensionToEdit?: IDomainExtension | null;
    onClose: () => void;
}

const DomainExtensionForm: React.FC<DomainExtensionFormProps> = ({
    extensionToEdit,
    onClose,
}) => {
    const queryClient = useQueryClient();
    const [generalError, setGeneralError] = useState<string | null>(null);
    const isEditMode = Boolean(extensionToEdit);

    const { data: fullExtension } = useQuery({
        queryKey: ["domain-extension", extensionToEdit?.id],
        queryFn: () => domainExtensionApi.getById(extensionToEdit!.id),
        enabled: Boolean(extensionToEdit?.id),
    });

    const editExtension = fullExtension || extensionToEdit;

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ExtensionFormData>({
        resolver: zodResolver(extensionSchema),
        defaultValues: {
            extension: "",
            price: "",
            period: "yr",
            badge: "",
            sort_order: 0,
            is_active: true,
        },
    });

    useEffect(() => {
        if (editExtension) {
            reset({
                extension: editExtension.extension,
                price: editExtension.price,
                period: editExtension.period || "yr",
                badge: editExtension.badge || "",
                sort_order: editExtension.sort_order,
                is_active: editExtension.is_active,
            });
        }
    }, [editExtension, reset]);

    const invalidate = () => {
        queryClient.invalidateQueries({ queryKey: ["Domain Extension Table"] });
    };

    const buildPayload = (data: ExtensionFormData) => ({
        ...data,
        period: data.period?.trim() || "yr",
        badge: data.badge?.trim() || null,
    });

    const createMutation = useMutation({
        mutationFn: (data: ExtensionFormData) => domainExtensionApi.create(buildPayload(data)),
        onSuccess: () => {
            invalidate();
            toast.success("Domain extension saved");
            onClose();
        },
        onError: (error: any) => {
            setGeneralError(error?.message || "Could not save domain extension");
        },
    });

    const updateMutation = useMutation({
        mutationFn: (data: ExtensionFormData) =>
            domainExtensionApi.update(editExtension!.id, buildPayload(data)),
        onSuccess: () => {
            invalidate();
            queryClient.invalidateQueries({ queryKey: ["domain-extension", editExtension?.id] });
            toast.success("Domain extension updated");
            onClose();
        },
        onError: (error: any) => {
            setGeneralError(error?.message || "Could not update domain extension");
        },
    });

    const onSubmit = (data: ExtensionFormData) => {
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
                title="Domain pricing"
                description="Extension name and price shown on domain-related service pages."
            >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Controller
                        name="extension"
                        control={control}
                        render={({ field }) => (
                            <FormInput
                                label="Extension"
                                hint='e.g. ".com" or ".so"'
                                value={field.value || ""}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                error={errors.extension?.message}
                            />
                        )}
                    />
                    <Controller
                        name="price"
                        control={control}
                        render={({ field }) => (
                            <FormInput
                                label="Price"
                                hint='Amount only, e.g. "15"'
                                value={field.value || ""}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                error={errors.price?.message}
                            />
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Controller
                        name="period"
                        control={control}
                        render={({ field }) => (
                            <FormInput
                                label="Billing period"
                                hint='e.g. "yr" or "month"'
                                value={field.value || ""}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                error={errors.period?.message}
                            />
                        )}
                    />
                    <Controller
                        name="badge"
                        control={control}
                        render={({ field }) => (
                            <FormInput
                                label="Badge (optional)"
                                hint='e.g. "Most Popular"'
                                value={field.value || ""}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                error={errors.badge?.message}
                            />
                        )}
                    />
                </div>
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

export default DomainExtensionForm;
