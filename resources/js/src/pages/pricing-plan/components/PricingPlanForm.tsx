import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import ActionButton from "../../../components/ActionButton";
import Alert from "../../../components/Alert";
import FormInput from "../../../components/form/FormInput";
import FormSelect from "../../../components/form/FormSelect";
import { pricingPlanApi } from "../../../services/pricingPlan";
import { pricingSectionApi } from "../../../services/pricingSection";
import { IPricingPlan } from "../../../types";

const styleOptions = [
    { value: "standard", label: "Standard" },
    { value: "featured", label: "Featured" },
    { value: "premium", label: "Premium" },
];

const featureSchema = z.object({
    text: z.string().min(1, "Feature text is required"),
    included: z.boolean().optional(),
    hidden: z.boolean().optional(),
});

const planSchema = z.object({
    pricing_section_id: z.coerce.number().min(1, "Section is required"),
    name: z.string().min(1, "Name is required"),
    price: z.string().min(1, "Price is required"),
    price_period: z.string().optional(),
    style: z.enum(["standard", "featured", "premium"]),
    cta_text: z.string().optional(),
    cta_url: z.string().optional().or(z.literal("")),
    features: z.array(featureSchema).optional(),
    sort_order: z.coerce.number().min(0).optional(),
    is_active: z.boolean().optional(),
});

type PlanFormData = z.infer<typeof planSchema>;

interface PricingPlanFormProps {
    planToEdit?: IPricingPlan | null;
    onClose: () => void;
}

const PricingPlanForm: React.FC<PricingPlanFormProps> = ({ planToEdit, onClose }) => {
    const queryClient = useQueryClient();
    const [generalError, setGeneralError] = useState<string | null>(null);
    const isEditMode = Boolean(planToEdit);

    const { data: fullPlan } = useQuery({
        queryKey: ["pricing-plan", planToEdit?.id],
        queryFn: () => pricingPlanApi.getById(planToEdit!.id),
        enabled: Boolean(planToEdit?.id),
    });

    const editPlan = fullPlan || planToEdit;

    const { data: sectionsResponse } = useQuery({
        queryKey: ["Pricing Sections Select"],
        queryFn: () =>
            pricingSectionApi.getAll({
                per_page: 100,
                sort_by: "sort_order",
                sort_direction: "asc",
            }),
    });

    const sectionOptions =
        sectionsResponse?.data?.map((section) => ({
            value: String(section.id),
            label: section.title,
        })) || [];

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<PlanFormData>({
        resolver: zodResolver(planSchema),
        defaultValues: {
            pricing_section_id: 0,
            name: "",
            price: "",
            price_period: "",
            style: "standard",
            cta_text: "",
            cta_url: "",
            features: [],
            sort_order: 0,
            is_active: true,
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "features",
    });

    useEffect(() => {
        if (editPlan) {
            reset({
                pricing_section_id: editPlan.pricing_section_id,
                name: editPlan.name,
                price: editPlan.price,
                price_period: editPlan.price_period || "",
                style: editPlan.style,
                cta_text: editPlan.cta_text || "",
                cta_url: editPlan.cta_url || "",
                features: editPlan.features?.length
                    ? editPlan.features.map((feature) => ({
                          text: feature.text,
                          included: feature.included ?? true,
                          hidden: feature.hidden ?? false,
                      }))
                    : [],
                sort_order: editPlan.sort_order,
                is_active: editPlan.is_active,
            });
        }
    }, [editPlan, reset]);

    const createMutation = useMutation({
        mutationFn: (data: PlanFormData) => pricingPlanApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["Pricing Plan Table"] });
            toast.success("Pricing plan created successfully");
            onClose();
        },
        onError: (error: any) => {
            setGeneralError(error?.message || "Failed to create pricing plan");
        },
    });

    const updateMutation = useMutation({
        mutationFn: (data: PlanFormData) => pricingPlanApi.update(planToEdit!.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["Pricing Plan Table"] });
            queryClient.invalidateQueries({ queryKey: ["pricing-plan", planToEdit?.id] });
            toast.success("Pricing plan updated successfully");
            onClose();
        },
        onError: (error: any) => {
            setGeneralError(error?.message || "Failed to update pricing plan");
        },
    });

    const onSubmit = (data: PlanFormData) => {
        setGeneralError(null);
        const payload = {
            ...data,
            price_period: data.price_period?.trim() || null,
            cta_text: data.cta_text?.trim() || null,
            cta_url: data.cta_url?.trim() || null,
            features: data.features?.length ? data.features : [],
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
                name="pricing_section_id"
                control={control}
                render={({ field }) => (
                    <FormSelect
                        label="Section"
                        options={sectionOptions}
                        value={String(field.value || "")}
                        onChange={(value) => field.onChange(Number(value))}
                        onBlur={field.onBlur}
                        error={errors.pricing_section_id?.message}
                    />
                )}
            />

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

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Controller
                    name="price"
                    control={control}
                    render={({ field }) => (
                        <FormInput
                            label="Price"
                            value={field.value || ""}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            error={errors.price?.message}
                        />
                    )}
                />

                <Controller
                    name="price_period"
                    control={control}
                    render={({ field }) => (
                        <FormInput
                            label="Price Period"
                            value={field.value || ""}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            error={errors.price_period?.message}
                            placeholder="e.g. month, year"
                        />
                    )}
                />
            </div>

            <Controller
                name="style"
                control={control}
                render={({ field }) => (
                    <FormSelect
                        label="Style"
                        options={styleOptions}
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        error={errors.style?.message}
                    />
                )}
            />

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Controller
                    name="cta_text"
                    control={control}
                    render={({ field }) => (
                        <FormInput
                            label="CTA Text"
                            value={field.value || ""}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            error={errors.cta_text?.message}
                        />
                    )}
                />

                <Controller
                    name="cta_url"
                    control={control}
                    render={({ field }) => (
                        <FormInput
                            label="CTA URL"
                            value={field.value || ""}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            error={errors.cta_url?.message}
                        />
                    )}
                />
            </div>

            <div>
                <div className="mb-2 flex items-center justify-between">
                    <label className="font-medium">Features</label>
                    <button
                        type="button"
                        className="btn btn-sm btn-outline-primary gap-1"
                        onClick={() =>
                            append({ text: "", included: true, hidden: false })
                        }
                    >
                        <Plus size={14} />
                        Add Feature
                    </button>
                </div>

                {fields.length === 0 && (
                    <p className="text-sm text-gray-500">No features added yet.</p>
                )}

                <div className="space-y-3">
                    {fields.map((field, index) => (
                        <div
                            key={field.id}
                            className="rounded border border-gray-200 p-3 dark:border-gray-700"
                        >
                            <div className="mb-2 flex items-start justify-between gap-2">
                                <span className="text-sm font-medium text-gray-500">
                                    Feature {index + 1}
                                </span>
                                <button
                                    type="button"
                                    className="text-danger hover:opacity-80"
                                    onClick={() => remove(index)}
                                    aria-label={`Remove feature ${index + 1}`}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <Controller
                                name={`features.${index}.text`}
                                control={control}
                                render={({ field: textField }) => (
                                    <FormInput
                                        label="Text"
                                        value={textField.value || ""}
                                        onChange={textField.onChange}
                                        onBlur={textField.onBlur}
                                        error={errors.features?.[index]?.text?.message}
                                    />
                                )}
                            />

                            <div className="mt-2 flex flex-wrap gap-4">
                                <Controller
                                    name={`features.${index}.included`}
                                    control={control}
                                    render={({ field: includedField }) => (
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={includedField.value ?? true}
                                                onChange={(event) =>
                                                    includedField.onChange(event.target.checked)
                                                }
                                            />
                                            <span>Included</span>
                                        </label>
                                    )}
                                />

                                <Controller
                                    name={`features.${index}.hidden`}
                                    control={control}
                                    render={({ field: hiddenField }) => (
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={hiddenField.value ?? false}
                                                onChange={(event) =>
                                                    hiddenField.onChange(event.target.checked)
                                                }
                                            />
                                            <span>Hidden</span>
                                        </label>
                                    )}
                                />
                            </div>
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

export default PricingPlanForm;
