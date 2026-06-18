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
import { faqApi } from "../../../services/faq";
import { IFaq } from "../../../types";

const faqSchema = z.object({
    question: z.string().min(1, "Question is required"),
    answer_paragraphs: z.array(z.string()).optional(),
    sort_order: z.coerce.number().min(0).optional(),
    is_active: z.boolean().optional(),
});

type FaqFormData = z.infer<typeof faqSchema>;

interface FaqFormProps {
    faqToEdit?: IFaq | null;
    onClose: () => void;
}

const FaqForm: React.FC<FaqFormProps> = ({ faqToEdit, onClose }) => {
    const queryClient = useQueryClient();
    const [generalError, setGeneralError] = useState<string | null>(null);
    const isEditMode = Boolean(faqToEdit);

    const { data: fullFaq } = useQuery({
        queryKey: ["faq", faqToEdit?.id],
        queryFn: () => faqApi.getById(faqToEdit!.id),
        enabled: Boolean(faqToEdit?.id),
    });

    const editFaq = fullFaq || faqToEdit;

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FaqFormData>({
        resolver: zodResolver(faqSchema),
        defaultValues: {
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
                question: editFaq.question,
                answer_paragraphs: editFaq.answer_paragraphs?.length
                    ? editFaq.answer_paragraphs
                    : [],
                sort_order: editFaq.sort_order,
                is_active: editFaq.is_active,
            });
        }
    }, [editFaq, reset]);

    const createMutation = useMutation({
        mutationFn: (data: FaqFormData) =>
            faqApi.create({
                ...data,
                answer_paragraphs: data.answer_paragraphs?.filter((p) => p.trim()) || [],
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["FAQ Table"] });
            toast.success("FAQ created successfully");
            onClose();
        },
        onError: (error: any) => {
            setGeneralError(error?.message || "Failed to create FAQ");
        },
    });

    const updateMutation = useMutation({
        mutationFn: (data: FaqFormData) =>
            faqApi.update(editFaq!.id, {
                ...data,
                answer_paragraphs: data.answer_paragraphs?.filter((p) => p.trim()) || [],
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["FAQ Table"] });
            queryClient.invalidateQueries({ queryKey: ["faq", editFaq?.id] });
            toast.success("FAQ updated successfully");
            onClose();
        },
        onError: (error: any) => {
            setGeneralError(error?.message || "Failed to update FAQ");
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

            <Controller
                name="question"
                control={control}
                render={({ field }) => (
                    <FormInput
                        label="Question"
                        value={field.value || ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        error={errors.question?.message}
                    />
                )}
            />

            <div>
                <div className="mb-2 flex items-center justify-between">
                    <label className="font-medium">Answer Paragraphs</label>
                    <button
                        type="button"
                        className="btn btn-sm btn-outline-primary gap-1"
                        onClick={() => append("")}
                    >
                        <Plus size={14} />
                        Add Paragraph
                    </button>
                </div>

                {fields.length === 0 && (
                    <p className="text-sm text-gray-500">No answer paragraphs added yet.</p>
                )}

                <div className="space-y-2">
                    {fields.map((field, index) => (
                        <div key={field.id} className="flex items-start gap-2">
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
                            <button
                                type="button"
                                className="btn btn-sm btn-outline-danger mt-1"
                                onClick={() => remove(index)}
                                aria-label={`Remove paragraph ${index + 1}`}
                            >
                                <Trash2 size={14} />
                            </button>
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

export default FaqForm;
