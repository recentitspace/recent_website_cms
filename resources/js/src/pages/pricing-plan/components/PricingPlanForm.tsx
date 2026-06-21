import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";


import Alert from "../../../components/Alert";
import FormAdvancedFields from "../../../components/form/FormAdvancedFields";
import FormFooter from "../../../components/form/FormFooter";
import FormInput from "../../../components/form/FormInput";
import FormSection from "../../../components/form/FormSection";
import FormSelect from "../../../components/form/FormSelect";
import FormToggle from "../../../components/form/FormToggle";
import { useSimpleFormMode } from "../../../hooks/useSimpleFormMode";
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
    defaultPricingSectionId?: number | null;
    onClose: () => void;
}

const PricingPlanForm: React.FC<PricingPlanFormProps> = ({
    planToEdit,
    defaultPricingSectionId,
    onClose,
}) => {
    const queryClient = useQueryClient();
    const simpleMode = useSimpleFormMode();
    const [generalError, setGeneralError] = useState<string | null>(null);
    const isEditMode = Boolean(planToEdit);

    const { data: fullPlan } = useQuery({
        queryKey: ["pricing-plan", planToEdit?.id],
        queryFn: () => pricingPlanApi.getById(planToEdit!.id),
        enabled: Boolean(planToEdit?.id),
    });

    const editPlan = fullPlan || planToEdit;

    const hideSectionSelect =
        simpleMode ||
        Boolean(defaultPricingSectionId) ||
        (Boolean(planToEdit) && Boolean(planToEdit?.pricing_section_id));

    const { data: sectionsResponse } = useQuery({
        queryKey: ["Pricing Sections Select"],
        queryFn: () =>
            pricingSectionApi.getAll({
                per_page: 100,
                sort_by: "sort_order",
                sort_direction: "asc",
            }),
        enabled: !hideSectionSelect,
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
            return;
        }

        reset({
            pricing_section_id: defaultPricingSectionId || 0,
            name: "",
            price: "",
            price_period: "",
            style: "standard",
            cta_text: "",
            cta_url: "",
            features: [],
            sort_order: 0,
            is_active: true,
        });
    }, [editPlan, defaultPricingSectionId, reset]);

    const createMutation = useMutation({
        mutationFn: (data: PlanFormData) => pricingPlanApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["Pricing Plan Table"] });
            queryClient.invalidateQueries({ queryKey: ["editor-pricing-plans"] });
            toast.success("Plan saved");
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
            queryClient.invalidateQueries({ queryKey: ["editor-pricing-plans"] });
            queryClient.invalidateQueries({ queryKey: ["pricing-plan", planToEdit?.id] });
            toast.success("Plan updated");
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

            {!hideSectionSelect && (
                <Controller
                    name="pricing_section_id"
                    control={control}
                    render={({ field }) => (
                        <FormSelect
                            label="Pricing category"
                            options={sectionOptions}
                            value={String(field.value || "")}
                            onChange={(value) => field.onChange(Number(value))}
                            onBlur={field.onBlur}
                            error={errors.pricing_section_id?.message}
                        />
                    )}
                />
            )}

            <FormSection title="Plan details" description="Name and price visitors see on the card.">
            <Controller
                name="name"
                control={control}
                render={({ field }) => (
                    <FormInput
                        label="Plan name"
                        hint='e.g. "Starter" or "Professional"'
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
                            hint='e.g. "$99" or "From $500"'
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
                            label="Billing period"
                            value={field.value || ""}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            error={errors.price_period?.message}
                            placeholder="month, year, one-time"
                        />
                    )}
                />
            </div>
            </FormSection>

            <FormSection title="Button" description="Optional call-to-action on the plan card.">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Controller
                    name="cta_text"
                    control={control}
                    render={({ field }) => (
                        <FormInput
                            label="Button text"
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
                            label="Button link"
                            value={field.value || ""}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            error={errors.cta_url?.message}
                        />
                    )}
                />
            </div>
            </FormSection>

            <FormSection title="What's included" description="List features shown on this plan.">
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
                        Add feature
                    </button>
                </div>

                {fields.length === 0 && (
                    <p className="rounded-lg border border-dashed border-gray-300 px-4 py-6 text-center text-sm text-gray-500 dark:border-gray-600">
                        Add features like “Unlimited revisions” or “24/7 support”.
                    </p>
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
                                        label="Feature text"
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
            </FormSection>

            <FormAdvancedFields>
            <Controller
                name="style"
                control={control}
                render={({ field }) => (
                    <FormSelect
                        label="Card style"
                        options={styleOptions}
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        error={errors.style?.message}
                    />
                )}
            />

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

export default PricingPlanForm;
