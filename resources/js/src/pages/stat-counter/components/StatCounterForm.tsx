import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import Alert from "../../../components/Alert";
import MediaSelect from "../../../components/media/MediaSelect";
import FormAdvancedFields from "../../../components/form/FormAdvancedFields";
import FormFooter from "../../../components/form/FormFooter";
import FormInput from "../../../components/form/FormInput";
import FormSection from "../../../components/form/FormSection";
import FormToggle from "../../../components/form/FormToggle";
import { statCounterApi } from "../../../services/statCounter";
import { IMedia, IStatCounter } from "../../../types";

const statCounterSchema = z.object({
    label: z.string().min(1, "Description is required"),
    value: z.string().min(1, "Number is required"),
    suffix: z.string().optional(),
    icon_id: z.number().nullable().optional(),
    sort_order: z.coerce.number().min(0).optional(),
    is_active: z.boolean().optional(),
    show_on_home: z.boolean().optional(),
});

type StatCounterFormData = z.infer<typeof statCounterSchema>;

interface StatCounterFormProps {
    counterToEdit?: IStatCounter | null;
    onClose: () => void;
}

const StatCounterForm: React.FC<StatCounterFormProps> = ({ counterToEdit, onClose }) => {
    const queryClient = useQueryClient();
    const [generalError, setGeneralError] = useState<string | null>(null);
    const [selectedIcon, setSelectedIcon] = useState<IMedia | null>(null);
    const isEditMode = Boolean(counterToEdit);

    const { data: fullCounter } = useQuery({
        queryKey: ["stat-counter", counterToEdit?.id],
        queryFn: () => statCounterApi.getById(counterToEdit!.id),
        enabled: Boolean(counterToEdit?.id),
    });

    const editCounter = fullCounter || counterToEdit;

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<StatCounterFormData>({
        resolver: zodResolver(statCounterSchema),
        defaultValues: {
            label: "",
            value: "",
            suffix: "",
            icon_id: null,
            sort_order: 0,
            is_active: true,
            show_on_home: true,
        },
    });

    useEffect(() => {
        if (editCounter) {
            reset({
                label: editCounter.label,
                value: editCounter.value,
                suffix: editCounter.suffix || "",
                icon_id: editCounter.icon_id || null,
                sort_order: editCounter.sort_order,
                is_active: editCounter.is_active,
                show_on_home: editCounter.show_on_home,
            });
            setSelectedIcon(editCounter.icon || null);
        }
    }, [editCounter, reset]);

    const invalidate = () => {
        queryClient.invalidateQueries({ queryKey: ["Stat Counter Table"] });
        queryClient.invalidateQueries({ queryKey: ["editor-home-counters"] });
    };

    const createMutation = useMutation({
        mutationFn: (data: StatCounterFormData) =>
            statCounterApi.create({
                ...data,
                suffix: data.suffix?.trim() || null,
                icon_id: data.icon_id || null,
            }),
        onSuccess: () => {
            invalidate();
            toast.success("Statistic saved");
            onClose();
        },
        onError: (error: any) => {
            setGeneralError(error?.message || "Could not save statistic");
        },
    });

    const updateMutation = useMutation({
        mutationFn: (data: StatCounterFormData) =>
            statCounterApi.update(editCounter!.id, {
                ...data,
                suffix: data.suffix?.trim() || null,
                icon_id: data.icon_id || null,
            }),
        onSuccess: () => {
            invalidate();
            queryClient.invalidateQueries({ queryKey: ["stat-counter", editCounter?.id] });
            toast.success("Statistic updated");
            onClose();
        },
        onError: (error: any) => {
            setGeneralError(error?.message || "Could not update statistic");
        },
    });

    const onSubmit = (data: StatCounterFormData) => {
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
                title="The number"
                description="What visitors see in the stats row on your homepage."
            >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Controller
                        name="value"
                        control={control}
                        render={({ field }) => (
                            <FormInput
                                label="Number"
                                hint='e.g. "150" or "10"'
                                value={field.value || ""}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                error={errors.value?.message}
                            />
                        )}
                    />
                    <Controller
                        name="suffix"
                        control={control}
                        render={({ field }) => (
                            <FormInput
                                label="Symbol after number"
                                hint='Optional: +, %, K, yrs'
                                value={field.value || ""}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                error={errors.suffix?.message}
                            />
                        )}
                    />
                </div>

                <Controller
                    name="label"
                    control={control}
                    render={({ field }) => (
                        <FormInput
                            label="What it means"
                            hint='e.g. "Happy clients" or "Projects completed"'
                            value={field.value || ""}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            error={errors.label?.message}
                        />
                    )}
                />
            </FormSection>

            <FormSection title="Icon" description="Small icon shown next to the number (optional).">
                <Controller
                    name="icon_id"
                    control={control}
                    render={({ field }) => (
                        <MediaSelect
                            label="Icon image"
                            value={field.value}
                            selectedMedia={selectedIcon}
                            onChange={(mediaId, media) => {
                                field.onChange(mediaId);
                                setSelectedIcon(media || null);
                            }}
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
                <Controller
                    name="show_on_home"
                    control={control}
                    render={({ field }) => (
                        <FormToggle
                            label="Show on home page"
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

export default StatCounterForm;
