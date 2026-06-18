import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import ActionButton from "../../../components/ActionButton";
import Alert from "../../../components/Alert";
import MediaSelect from "../../../components/media/MediaSelect";
import FormInput from "../../../components/form/FormInput";
import { statCounterApi } from "../../../services/statCounter";
import { IMedia, IStatCounter } from "../../../types";

const statCounterSchema = z.object({
    label: z.string().min(1, "Label is required"),
    value: z.string().min(1, "Value is required"),
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

    const createMutation = useMutation({
        mutationFn: (data: StatCounterFormData) =>
            statCounterApi.create({
                ...data,
                suffix: data.suffix?.trim() || null,
                icon_id: data.icon_id || null,
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["Stat Counter Table"] });
            toast.success("Stat counter created successfully");
            onClose();
        },
        onError: (error: any) => {
            setGeneralError(error?.message || "Failed to create stat counter");
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
            queryClient.invalidateQueries({ queryKey: ["Stat Counter Table"] });
            queryClient.invalidateQueries({ queryKey: ["stat-counter", editCounter?.id] });
            toast.success("Stat counter updated successfully");
            onClose();
        },
        onError: (error: any) => {
            setGeneralError(error?.message || "Failed to update stat counter");
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

            <Controller
                name="label"
                control={control}
                render={({ field }) => (
                    <FormInput
                        label="Label"
                        value={field.value || ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        error={errors.label?.message}
                    />
                )}
            />

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Controller
                    name="value"
                    control={control}
                    render={({ field }) => (
                        <FormInput
                            label="Value"
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
                            label="Suffix (optional)"
                            value={field.value || ""}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            error={errors.suffix?.message}
                            placeholder="e.g. +, %, K"
                        />
                    )}
                />
            </div>

            <Controller
                name="icon_id"
                control={control}
                render={({ field }) => (
                    <MediaSelect
                        label="Icon"
                        value={field.value}
                        selectedMedia={selectedIcon}
                        onChange={(mediaId, media) => {
                            field.onChange(mediaId);
                            setSelectedIcon(media || null);
                        }}
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

            <Controller
                name="show_on_home"
                control={control}
                render={({ field }) => (
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={field.value ?? true}
                            onChange={(event) => field.onChange(event.target.checked)}
                        />
                        <span>Show on Home</span>
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

export default StatCounterForm;
