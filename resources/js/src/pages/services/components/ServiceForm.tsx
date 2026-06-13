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
import { serviceApi } from "../../../services/service";
import { IService } from "../../../types/service";

const featureSchema = z.object({
    id: z.number().optional(),
    label: z.string().min(1, "Label is required"),
    sort_order: z.number().optional(),
    show_in_card: z.boolean().optional(),
});

const processStepSchema = z.object({
    id: z.number().optional(),
    step_number: z.number().min(1),
    title: z.string().min(1, "Title is required"),
    description: z.string().optional().nullable(),
    tasks: z.array(z.string()).optional(),
    sort_order: z.number().optional(),
});

const faqSchema = z.object({
    id: z.number().optional(),
    question: z.string().min(1, "Question is required"),
    answer: z.string().min(1, "Answer is required"),
    sort_order: z.number().optional(),
});

const serviceSchema = z.object({
    type: z.enum(["category", "service"]),
    parent_id: z.number().nullable().optional(),
    slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens"),
    name: z.string().min(1, "Name is required"),
    short_name: z.string().optional().nullable(),
    icon: z.string().optional().nullable(),
    hero_image: z.string().optional().nullable(),
    banner_title: z.string().optional().nullable(),
    banner_subtitle: z.string().optional().nullable(),
    hero_title: z.string().optional().nullable(),
    hero_title_highlight: z.string().optional().nullable(),
    hero_description: z.string().optional().nullable(),
    section_title: z.string().optional().nullable(),
    section_subtitle: z.string().optional().nullable(),
    cta_text: z.string().optional().nullable(),
    cta_url: z.string().optional().nullable(),
    portfolio_category: z.string().optional().nullable(),
    pricing_category_slug: z.string().optional().nullable(),
    show_in_nav: z.boolean(),
    show_on_homepage: z.boolean(),
    sort_order: z.number().min(0),
    status: z.enum(["draft", "published"]),
    meta_title: z.string().optional().nullable(),
    meta_description: z.string().optional().nullable(),
    features: z.array(featureSchema).optional(),
    process_steps: z.array(processStepSchema).optional(),
    faqs: z.array(faqSchema).optional(),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

interface ServiceFormProps {
    serviceToEdit?: IService | null;
    defaultParentId?: number | null;
    defaultType?: "category" | "service";
    onClose: () => void;
}

const ServiceForm: React.FC<ServiceFormProps> = ({
    serviceToEdit,
    defaultParentId,
    defaultType = "category",
    onClose,
}) => {
    const queryClient = useQueryClient();
    const [generalError, setGeneralError] = useState<string | null>(null);
    const isEditMode = Boolean(serviceToEdit);

    const { data: tree = [] } = useQuery({
        queryKey: ["services-tree"],
        queryFn: () => serviceApi.getTree(),
    });

    const { data: referenceOptions } = useQuery({
        queryKey: ["services-reference-options"],
        queryFn: () => serviceApi.getReferenceOptions(),
    });

    const {
        control,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<ServiceFormData>({
        resolver: zodResolver(serviceSchema),
        defaultValues: {
            type: defaultType,
            parent_id: defaultParentId ?? null,
            slug: "",
            name: "",
            show_in_nav: true,
            show_on_homepage: true,
            sort_order: 0,
            status: "published",
            features: [],
            process_steps: [],
            faqs: [],
        },
    });

    const serviceType = watch("type");

    const {
        fields: featureFields,
        append: appendFeature,
        remove: removeFeature,
    } = useFieldArray({ control, name: "features" });

    const {
        fields: stepFields,
        append: appendStep,
        remove: removeStep,
    } = useFieldArray({ control, name: "process_steps" });

    const {
        fields: faqFields,
        append: appendFaq,
        remove: removeFaq,
    } = useFieldArray({ control, name: "faqs" });

    useEffect(() => {
        if (serviceToEdit) {
            reset({
                type: serviceToEdit.type,
                parent_id: serviceToEdit.parent_id ?? null,
                slug: serviceToEdit.slug,
                name: serviceToEdit.name,
                short_name: serviceToEdit.short_name ?? "",
                icon: serviceToEdit.icon ?? "",
                hero_image: serviceToEdit.hero_image ?? "",
                banner_title: serviceToEdit.banner_title ?? "",
                banner_subtitle: serviceToEdit.banner_subtitle ?? "",
                hero_title: serviceToEdit.hero_title ?? "",
                hero_title_highlight: serviceToEdit.hero_title_highlight ?? "",
                hero_description: serviceToEdit.hero_description ?? "",
                section_title: serviceToEdit.section_title ?? "",
                section_subtitle: serviceToEdit.section_subtitle ?? "",
                cta_text: serviceToEdit.cta_text ?? "",
                cta_url: serviceToEdit.cta_url ?? "",
                portfolio_category: serviceToEdit.portfolio_category ?? "",
                pricing_category_slug: serviceToEdit.pricing_category_slug ?? "",
                show_in_nav: serviceToEdit.show_in_nav,
                show_on_homepage: serviceToEdit.show_on_homepage,
                sort_order: serviceToEdit.sort_order,
                status: serviceToEdit.status,
                meta_title: serviceToEdit.meta_title ?? "",
                meta_description: serviceToEdit.meta_description ?? "",
                features: serviceToEdit.features ?? [],
                process_steps: serviceToEdit.process_steps ?? serviceToEdit.processSteps ?? [],
                faqs: serviceToEdit.faqs ?? [],
            });
        }
    }, [serviceToEdit, reset]);

    const createMutation = useMutation({
        mutationFn: (data: ServiceFormData) => serviceApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["services-tree"] });
            toast.success("Service created successfully");
            onClose();
        },
        onError: (error: any) => {
            setGeneralError(error?.message || "Failed to create service");
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: ServiceFormData }) =>
            serviceApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["services-tree"] });
            toast.success("Service updated successfully");
            onClose();
        },
        onError: (error: any) => {
            setGeneralError(error?.message || "Failed to update service");
        },
    });

    const onSubmit = (data: ServiceFormData) => {
        setGeneralError(null);
        const payload = {
            ...data,
            parent_id: data.type === "category" ? null : data.parent_id,
            short_name: data.short_name || null,
            icon: data.icon || null,
            hero_image: data.hero_image || null,
            portfolio_category: data.portfolio_category || null,
            pricing_category_slug: data.pricing_category_slug || null,
        };

        if (isEditMode && serviceToEdit) {
            updateMutation.mutate({ id: serviceToEdit.id, data: payload });
        } else {
            createMutation.mutate(payload);
        }
    };

    const categoryOptions = tree.map((cat) => ({
        value: String(cat.id),
        label: cat.name,
    }));

    const portfolioOptions = (referenceOptions?.portfolio_categories ?? []).map((v) => ({
        value: v,
        label: v,
    }));

    const pricingOptions = (referenceOptions?.pricing_category_slugs ?? []).map((v) => ({
        value: v,
        label: v,
    }));

    const isLoading = isSubmitting || createMutation.isPending || updateMutation.isPending;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
            {generalError && <Alert type="danger" message={generalError} />}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                        <FormSelect
                            label="Type"
                            value={field.value}
                            onChange={field.onChange}
                            options={[
                                { value: "category", label: "Category (Pillar)" },
                                { value: "service", label: "Service (Child)" },
                            ]}
                            error={errors.type?.message}
                            disabled={isEditMode}
                        />
                    )}
                />

                {serviceType === "service" && (
                    <Controller
                        name="parent_id"
                        control={control}
                        render={({ field }) => (
                            <FormSelect
                                label="Parent Category"
                                value={field.value ?? ""}
                                onChange={(v) => field.onChange(v ? Number(v) : null)}
                                options={categoryOptions}
                                error={errors.parent_id?.message}
                                disabled={isEditMode}
                            />
                        )}
                    />
                )}

                <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                        <FormInput label="Name" {...field} error={errors.name?.message} required />
                    )}
                />

                <Controller
                    name="slug"
                    control={control}
                    render={({ field }) => (
                        <FormInput label="Slug" {...field} error={errors.slug?.message} required />
                    )}
                />

                <Controller
                    name="short_name"
                    control={control}
                    render={({ field }) => (
                        <FormInput label="Short Name" {...field} value={field.value ?? ""} />
                    )}
                />

                <Controller
                    name="sort_order"
                    control={control}
                    render={({ field }) => (
                        <FormInput
                            label="Sort Order"
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                    )}
                />

                <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                        <FormSelect
                            label="Status"
                            value={field.value}
                            onChange={field.onChange}
                            options={[
                                { value: "published", label: "Published" },
                                { value: "draft", label: "Draft" },
                            ]}
                        />
                    )}
                />

                <Controller
                    name="icon"
                    control={control}
                    render={({ field }) => (
                        <FormInput label="Icon URL" {...field} value={field.value ?? ""} />
                    )}
                />

                <Controller
                    name="hero_image"
                    control={control}
                    render={({ field }) => (
                        <FormInput label="Hero Image URL" {...field} value={field.value ?? ""} />
                    )}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Controller
                    name="show_in_nav"
                    control={control}
                    render={({ field }) => (
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={field.value} onChange={field.onChange} />
                            <span>Show in navigation</span>
                        </label>
                    )}
                />
                <Controller
                    name="show_on_homepage"
                    control={control}
                    render={({ field }) => (
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={field.value} onChange={field.onChange} />
                            <span>Show on homepage</span>
                        </label>
                    )}
                />
            </div>

            {serviceType === "category" && (
                <div className="grid grid-cols-1 gap-4 border-t pt-4">
                    <h3 className="font-semibold">Category Page Content</h3>
                    <Controller name="hero_title" control={control} render={({ field }) => (
                        <FormInput label="Hero Title (use \\n for line break)" {...field} value={field.value ?? ""} />
                    )} />
                    <Controller name="hero_title_highlight" control={control} render={({ field }) => (
                        <FormInput label="Hero Title Highlight" {...field} value={field.value ?? ""} />
                    )} />
                    <Controller name="hero_description" control={control} render={({ field }) => (
                        <div className="space-y-2">
                            <label className="block text-sm font-medium">Hero Description</label>
                            <textarea {...field} value={field.value ?? ""} rows={3} className="form-textarea w-full" />
                        </div>
                    )} />
                    <Controller name="section_title" control={control} render={({ field }) => (
                        <FormInput label="Section Title" {...field} value={field.value ?? ""} />
                    )} />
                    <Controller name="section_subtitle" control={control} render={({ field }) => (
                        <div className="space-y-2">
                            <label className="block text-sm font-medium">Section Subtitle</label>
                            <textarea {...field} value={field.value ?? ""} rows={2} className="form-textarea w-full" />
                        </div>
                    )} />
                </div>
            )}

            {serviceType === "service" && (
                <div className="grid grid-cols-1 gap-4 border-t pt-4">
                    <h3 className="font-semibold">Service Detail Content</h3>
                    <Controller name="banner_title" control={control} render={({ field }) => (
                        <FormInput label="Banner Title" {...field} value={field.value ?? ""} />
                    )} />
                    <Controller name="banner_subtitle" control={control} render={({ field }) => (
                        <div className="space-y-2">
                            <label className="block text-sm font-medium">Banner Subtitle</label>
                            <textarea {...field} value={field.value ?? ""} rows={2} className="form-textarea w-full" />
                        </div>
                    )} />
                    <Controller name="portfolio_category" control={control} render={({ field }) => (
                        portfolioOptions.length > 0 ? (
                            <FormSelect label="Portfolio Category" value={field.value ?? ""} onChange={field.onChange} options={[{ value: "", label: "None" }, ...portfolioOptions]} />
                        ) : (
                            <FormInput label="Portfolio Category" {...field} value={field.value ?? ""} placeholder="From portfolio module when available" />
                        )
                    )} />
                    <Controller name="pricing_category_slug" control={control} render={({ field }) => (
                        pricingOptions.length > 0 ? (
                            <FormSelect label="Pricing Category Slug" value={field.value ?? ""} onChange={field.onChange} options={[{ value: "", label: "None" }, ...pricingOptions]} />
                        ) : (
                            <FormInput label="Pricing Category Slug" {...field} value={field.value ?? ""} placeholder="From pricing module when available" />
                        )
                    )} />
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                <Controller name="cta_text" control={control} render={({ field }) => (
                    <FormInput label="CTA Text" {...field} value={field.value ?? ""} />
                )} />
                <Controller name="cta_url" control={control} render={({ field }) => (
                    <FormInput label="CTA URL" {...field} value={field.value ?? ""} />
                )} />
                <Controller name="meta_title" control={control} render={({ field }) => (
                    <FormInput label="Meta Title" {...field} value={field.value ?? ""} />
                )} />
                <Controller name="meta_description" control={control} render={({ field }) => (
                    <div className="space-y-2 md:col-span-2">
                        <label className="block text-sm font-medium">Meta Description</label>
                        <textarea {...field} value={field.value ?? ""} rows={2} className="form-textarea w-full" />
                    </div>
                )} />
            </div>

            {serviceType === "service" && (
                <div className="border-t pt-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold">Features</h3>
                        <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => appendFeature({ label: "", sort_order: featureFields.length, show_in_card: true })}>
                            <Plus size={14} className="mr-1" /> Add Feature
                        </button>
                    </div>
                    {featureFields.map((field, index) => (
                        <div key={field.id} className="flex gap-2 items-start">
                            <Controller name={`features.${index}.label`} control={control} render={({ field }) => (
                                <FormInput label="" placeholder="Feature label" {...field} className="flex-1" />
                            )} />
                            <button type="button" className="btn btn-sm btn-outline-danger mt-1" onClick={() => removeFeature(index)}>
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <div className="border-t pt-4 space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Process Steps</h3>
                    <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => appendStep({ step_number: stepFields.length + 1, title: "", description: "", tasks: [], sort_order: stepFields.length })}>
                        <Plus size={14} className="mr-1" /> Add Step
                    </button>
                </div>
                {stepFields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-2 items-start border p-3 rounded">
                        <Controller name={`process_steps.${index}.step_number`} control={control} render={({ field }) => (
                            <FormInput label="Step #" type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                        )} />
                        <Controller name={`process_steps.${index}.title`} control={control} render={({ field }) => (
                            <FormInput label="Title" {...field} />
                        )} />
                        <div className="flex justify-end">
                            <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => removeStep(index)}>
                                <Trash2 size={14} />
                            </button>
                        </div>
                        <div className="md:col-span-3">
                            <Controller name={`process_steps.${index}.description`} control={control} render={({ field }) => (
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium">Description</label>
                                    <textarea {...field} value={field.value ?? ""} rows={2} className="form-textarea w-full" />
                                </div>
                            )} />
                        </div>
                    </div>
                ))}
            </div>

            {serviceType === "category" && (
                <div className="border-t pt-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold">FAQs</h3>
                        <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => appendFaq({ question: "", answer: "", sort_order: faqFields.length })}>
                            <Plus size={14} className="mr-1" /> Add FAQ
                        </button>
                    </div>
                    {faqFields.map((field, index) => (
                        <div key={field.id} className="border p-3 rounded space-y-2">
                            <Controller name={`faqs.${index}.question`} control={control} render={({ field }) => (
                                <FormInput label="Question" {...field} />
                            )} />
                            <Controller name={`faqs.${index}.answer`} control={control} render={({ field }) => (
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium">Answer</label>
                                    <textarea {...field} rows={3} className="form-textarea w-full" />
                                </div>
                            )} />
                            <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => removeFaq(index)}>
                                <Trash2 size={14} className="mr-1" /> Remove
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex justify-end gap-3 border-t pt-4">
                <ActionButton type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                    Cancel
                </ActionButton>
                <ActionButton type="submit" variant="primary" loading={isLoading}>
                    {isEditMode ? "Update" : "Create"}
                </ActionButton>
            </div>
        </form>
    );
};

export default ServiceForm;
