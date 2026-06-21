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
import { clientApi } from "../../../services/client";
import { IClient, IMedia } from "../../../types";

const clientSchema = z.object({
    name: z.string().min(1, "Company name is required"),
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

    const invalidate = () => {
        queryClient.invalidateQueries({ queryKey: ["Client Table"] });
        queryClient.invalidateQueries({ queryKey: ["editor-home-clients"] });
    };

    const createMutation = useMutation({
        mutationFn: (data: ClientFormData) =>
            clientApi.create({
                ...data,
                url: data.url || null,
                logo_id: data.logo_id || null,
            }),
        onSuccess: () => {
            invalidate();
            toast.success("Client logo saved");
            onClose();
        },
        onError: (error: any) => {
            setGeneralError(error?.message || "Could not save client");
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
            invalidate();
            queryClient.invalidateQueries({ queryKey: ["client", editClient?.id] });
            toast.success("Client logo updated");
            onClose();
        },
        onError: (error: any) => {
            setGeneralError(error?.message || "Could not update client");
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

            <FormSection
                title="Client details"
                description="Name and logo shown in the client logos row on the homepage."
            >
                <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                        <FormInput
                            label="Company name"
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
                            label="Logo image"
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
                            label="Website link"
                            hint="Optional — opens when visitors click the logo"
                            value={field.value || ""}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            error={errors.url?.message}
                            placeholder="https://..."
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
                            description="Display in the scrolling client logos row"
                            checked={field.value ?? false}
                            onChange={field.onChange}
                        />
                    )}
                />
            </FormAdvancedFields>

            <FormFooter onCancel={onClose} isSubmitting={isSubmitting} isEditMode={isEditMode} />
        </form>
    );
};

export default ClientForm;
