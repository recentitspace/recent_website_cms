import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import Alert from "../../../components/Alert";
import FormAdvancedFields from "../../../components/form/FormAdvancedFields";
import FormFieldList from "../../../components/form/FormFieldList";
import FormFooter from "../../../components/form/FormFooter";
import FormInput from "../../../components/form/FormInput";
import FormSection from "../../../components/form/FormSection";
import FormSelect from "../../../components/form/FormSelect";
import FormToggle from "../../../components/form/FormToggle";
import { useSimpleFormMode } from "../../../hooks/useSimpleFormMode";
import { faqApi } from "../../../services/faq";
import { serviceCategoryApi } from "../../../services/serviceCategory";
import { IFaq } from "../../../types";

const faqSchema = z.object({
    service_category_id: z.union([z.coerce.number(), z.literal("")]).optional(),
    question: z.string().min(1, "Question is required"),
    answer_paragraphs: z.array(z.string()).optional(),
    sort_order: z.coerce.number().min(0).optional(),
    is_active: z.boolean().optional(),
});

type FaqFormData = z.infer<typeof faqSchema>;

interface FaqFormProps {
    faqToEdit?: IFaq | null;
    defaultServiceCategoryId?: number | null;
    onClose: () => void;
}

const FaqForm: React.FC<FaqFormProps> = ({
    faqToEdit,
    defaultServiceCategoryId,
    onClose,
}) => {
    const queryClient = useQueryClient();
    const simpleMode = useSimpleFormMode();
    const [generalError, setGeneralError] = useState<string | null>(null);
    const isEditMode = Boolean(faqToEdit);
    const hideContext = simpleMode || defaultServiceCategoryId !== undefined;

    const { data: fullFaq } = useQuery({
        queryKey: ["faq", faqToEdit?.id],
        queryFn: () => faqApi.getById(faqToEdit!.id),
        enabled: Boolean(faqToEdit?.id),
    });

    const editFaq = fullFaq || faqToEdit;

    const { data: categoriesResponse } = useQuery({
        queryKey: ["Service Categories Select"],
        queryFn: () =>
            serviceCategoryApi.getAll({
                per_page: 100,
                sort_by: "sort_order",
                sort_direction: "asc",
            }),
        enabled: !hideContext,
    });

    const categoryOptions = [
        { value: "", label: "FAQ page (general)" },
        ...(categoriesResponse?.data?.map((category) => ({
            value: String(category.id),
            label: category.title,
        })) || []),
    ];

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FaqFormData>({
        resolver: zodResolver(faqSchema),
        defaultValues: {
            service_category_id: "",
            question: "",
            answer_paragraphs: [],
            sort_order: 0,
            is_active: true,
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "answer_paragraphs",
    });

    useEffect(() => {
        if (editFaq) {
            reset({
                service_category_id: editFaq.service_category_id
                    ? String(editFaq.service_category_id)
                    : "",
                question: editFaq.question,
                answer_paragraphs: editFaq.answer_paragraphs?.length
                    ? editFaq.answer_paragraphs
                    : [""],
                sort_order: editFaq.sort_order,
                is_active: editFaq.is_active,
            });
            return;
        }

        reset({
            service_category_id: defaultServiceCategoryId
                ? String(defaultServiceCategoryId)
                : "",
            question: "",
            answer_paragraphs: [""],
            sort_order: 0,
            is_active: true,
        });
    }, [editFaq, defaultServiceCategoryId, reset]);

    const invalidate = () => {
        queryClient.invalidateQueries({ queryKey: ["FAQ Table"] });
        queryClient.invalidateQueries({ queryKey: ["editor-faq-page-questions"] });
        queryClient.invalidateQueries({ queryKey: ["editor-category-faqs"] });
    };

    const buildPayload = (data: FaqFormData) => ({
        ...data,
        service_category_id: data.service_category_id
            ? Number(data.service_category_id)
            : null,
        answer_paragraphs: data.answer_paragraphs?.filter((p) => p.trim()) || [],
    });

    const createMutation = useMutation({
        mutationFn: (data: FaqFormData) => faqApi.create(buildPayload(data)),
        onSuccess: () => {
            invalidate();
            toast.success("Question saved");
            onClose();
        },
        onError: (error: any) => {
            setGeneralError(error?.message || "Could not save question");
        },
    });

    const updateMutation = useMutation({
        mutationFn: (data: FaqFormData) => faqApi.update(editFaq!.id, buildPayload(data)),
        onSuccess: () => {
            invalidate();
            queryClient.invalidateQueries({ queryKey: ["faq", editFaq?.id] });
            toast.success("Question updated");
            onClose();
        },
        onError: (error: any) => {
            setGeneralError(error?.message || "Could not update question");
        },
    });

    const onSubmit = (data: FaqFormData) => {
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

            {!hideContext && (
                <Controller
                    name="service_category_id"
                    control={control}
                    render={({ field }) => (
                        <FormSelect
                            label="Where does this appear?"
                            options={categoryOptions}
                            value={String(field.value ?? "")}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            error={errors.service_category_id?.message}
                        />
                    )}
                />
            )}

            <FormSection
                title="Question & answer"
                description="Write the question visitors see, then the answer below it."
            >
                <Controller
                    name="question"
                    control={control}
                    render={({ field }) => (
                        <FormInput
                            label="Question"
                            hint='e.g. "How long does a project take?"'
                            value={field.value || ""}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            error={errors.question?.message}
                        />
                    )}
                />

                <FormFieldList
                    label="Answer"
                    description="Add one or more short paragraphs. Each paragraph is a separate block of text."
                    addLabel="Add paragraph"
                    emptyMessage="Add at least one paragraph for the answer."
                    itemCount={fields.length}
                    onAdd={() => append("")}
                    onRemove={remove}
                    renderItem={(index) => (
                        <Controller
                            name={`answer_paragraphs.${index}`}
                            control={control}
                            render={({ field: paragraphField }) => (
                                <FormInput
                                    label=""
                                    value={paragraphField.value || ""}
                                    onChange={paragraphField.onChange}
                                    onBlur={paragraphField.onBlur}
                                    placeholder={`Paragraph ${index + 1}`}
                                />
                            )}
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

export default FaqForm;
