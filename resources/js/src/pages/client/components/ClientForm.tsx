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
import { clientApi } from "../../../services/client";
import { IClient, IMedia } from "../../../types";

const clientSchema = z.object({
    name: z.string().min(1, "Name is required"),
    logo_id: z.number().nullable().optional(),
    url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    sort_order: z.coerce.number().min(0).optional(),
    is_active: z.boolean().optional(),
    show_on_home: z.boolean().optional(),
});

type ClientFormData = z.infer<typeof clientSchema>;

interface ClientFormProps {
    clientToEdit?: IClient | null;
    onClose: () => void;
}

const ClientForm: React.FC<ClientFormProps> = ({ clientToEdit, onClose }) => {
    const queryClient = useQueryClient();
    const [generalError, setGeneralError] = useState<string | null>(null);
    const [selectedMedia, setSelectedMedia] = useState<IMedia | null>(null);
    const isEditMode = Boolean(clientToEdit);

    const { data: fullClient } = useQuery({
        queryKey: ["client", clientToEdit?.id],
        queryFn: () => clientApi.getById(clientToEdit!.id),
        enabled: Boolean(clientToEdit?.id),
    });

    const editClient = fullClient || clientToEdit;

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ClientFormData>({
        resolver: zodResolver(clientSchema),
        defaultValues: {
            name: "",
            logo_id: null,
            url: "",
            sort_order: 0,
            is_active: true,
            show_on_home: false,
        },
    });

    useEffect(() => {
        if (editClient) {
            reset({
                name: editClient.name,
                logo_id: editClient.logo_id || null,
                url: editClient.url || "",
                sort_order: editClient.sort_order,
                is_active: editClient.is_active,
                show_on_home: editClient.show_on_home,
            });
            setSelectedMedia(editClient.logo || null);
        }
    }, [editClient, reset]);

    const createMutation = useMutation({
        mutationFn: (data: ClientFormData) =>
            clientApi.create({
                ...data,
                url: data.url || null,
                logo_id: data.logo_id || null,
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["Client Table"] });
            toast.success("Client created successfully");
            onClose();
        },
        onError: (error: any) => {
            setGeneralError(error?.message || "Failed to create client");
        },
    });

    const updateMutation = useMutation({
        mutationFn: (data: ClientFormData) =>
            clientApi.update(editClient!.id, {
                ...data,
                url: data.url || null,
                logo_id: data.logo_id || null,
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["Client Table"] });
            queryClient.invalidateQueries({ queryKey: ["client", editClient?.id] });
            toast.success("Client updated successfully");
            onClose();
        },
        onError: (error: any) => {
            setGeneralError(error?.message || "Failed to update client");
        },
    });

    const onSubmit = (data: ClientFormData) => {
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
                name="logo_id"
                control={control}
                render={({ field }) => (
                    <MediaSelect
                        label="Logo"
                        value={field.value}
                        selectedMedia={selectedMedia}
                        onChange={(mediaId, media) => {
                            field.onChange(mediaId);
                            setSelectedMedia(media || null);
                        }}
                    />
                )}
            />

            <Controller
                name="url"
                control={control}
                render={({ field }) => (
                    <FormInput
                        label="Website URL (optional)"
                        value={field.value || ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        error={errors.url?.message}
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
                            checked={field.value ?? false}
                            onChange={(event) => field.onChange(event.target.checked)}
                        />
                        <span>Show on Home (brand slider)</span>
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

export default ClientForm;
