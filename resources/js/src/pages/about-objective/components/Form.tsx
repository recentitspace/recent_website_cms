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
import FormTextarea from "../../../components/form/FormTextarea";
import FormToggle from "../../../components/form/FormToggle";
import { aboutObjectiveApi } from "../../../services/aboutObjective";
import { IAboutObjective } from "../../../types";

const aboutObjectiveSchema = z.object({
    title: z.string().min(1, "Title is required"),
    body: z.string().optional(),
    sort_order: z.coerce.number().min(0).optional(),
    is_active: z.boolean().optional(),
});

type AboutObjectiveFormData = z.infer<typeof aboutObjectiveSchema>;

interface FormProps {
    objectiveToEdit?: IAboutObjective | null;
    onClose: () => void;
}

const Form: React.FC<FormProps> = ({ objectiveToEdit, onClose }) => {
    const queryClient = useQueryClient();
    const [generalError, setGeneralError] = useState<string | null>(null);
    const isEditMode = Boolean(objectiveToEdit);

    const { data: fullObjective } = useQuery({
        queryKey: ["about-objective", objectiveToEdit?.id],
        queryFn: () => aboutObjectiveApi.getById(objectiveToEdit!.id),
        enabled: Boolean(objectiveToEdit?.id),
    });

    const editObjective = fullObjective || objectiveToEdit;

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<AboutObjectiveFormData>({
        resolver: zodResolver(aboutObjectiveSchema),
        defaultValues: {
            title: "",
            body: "",
            sort_order: 0,
            is_active: true,
        },
    });

    useEffect(() => {
        if (editObjective) {
            reset({
                title: editObjective.title,
                body: editObjective.body || "",
                sort_order: editObjective.sort_order,
                is_active: editObjective.is_active,
            });
        }
    }, [editObjective, reset]);

    const invalidate = () => {
        queryClient.invalidateQueries({ queryKey: ["About Objective Table"] });
        queryClient.invalidateQueries({ queryKey: ["editor-about-objectives"] });
    };

    const buildPayload = (data: AboutObjectiveFormData) => ({
        ...data,
        body: data.body?.trim() || null,
    });

    const createMutation = useMutation({
        mutationFn: (data: AboutObjectiveFormData) => aboutObjectiveApi.create(buildPayload(data)),
        onSuccess: () => {
            invalidate();
            toast.success("About objective saved");
            onClose();
        },
        onError: (error: any) => {
            setGeneralError(error?.message || "Could not save about objective");
        },
    });

    const updateMutation = useMutation({
        mutationFn: (data: AboutObjectiveFormData) =>
            aboutObjectiveApi.update(editObjective!.id, buildPayload(data)),
        onSuccess: () => {
            invalidate();
            queryClient.invalidateQueries({ queryKey: ["about-objective", editObjective?.id] });
            toast.success("About objective updated");
            onClose();
        },
        onError: (error: any) => {
            setGeneralError(error?.message || "Could not update about objective");
        },
    });

    const onSubmit = (data: AboutObjectiveFormData) => {
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
                title="Objective content"
                description="Title and description for this about page objective."
            >
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
                    name="body"
                    control={control}
                    render={({ field }) => (
                        <FormTextarea
                            id="about-objective-body"
                            label="Description"
                            value={field.value || ""}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            error={errors.body?.message}
                            rows={3}
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

export default Form;
