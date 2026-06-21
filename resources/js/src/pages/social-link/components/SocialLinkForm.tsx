import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import ActionButton from "../../../components/ActionButton";
import Alert from "../../../components/Alert";
import FormInput from "../../../components/form/FormInput";
import FormSelect from "../../../components/form/FormSelect";
import { socialLinkApi } from "../../../services/socialLink";
import { ISocialLink } from "../../../types";

const platformOptions = [
    { value: "facebook", label: "Facebook" },
    { value: "instagram", label: "Instagram" },
    { value: "tiktok", label: "TikTok" },
    { value: "linkedin", label: "LinkedIn" },
    { value: "twitter", label: "Twitter / X" },
    { value: "youtube", label: "YouTube" },
    { value: "other", label: "Other" },
];

const socialLinkSchema = z.object({
    platform: z.enum([
        "facebook",
        "instagram",
        "tiktok",
        "linkedin",
        "twitter",
        "youtube",
        "other",
    ]),
    url: z.string().url("Must be a valid URL").min(1, "URL is required"),
    sort_order: z.coerce.number().min(0).optional(),
    is_active: z.boolean().optional(),
});

type SocialLinkFormData = z.infer<typeof socialLinkSchema>;

interface SocialLinkFormProps {
    socialLinkToEdit?: ISocialLink | null;
    onClose: () => void;
}

const SocialLinkForm: React.FC<SocialLinkFormProps> = ({
    socialLinkToEdit,
    onClose,
}) => {
    const queryClient = useQueryClient();
    const [generalError, setGeneralError] = useState<string | null>(null);
    const isEditMode = Boolean(socialLinkToEdit);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<SocialLinkFormData>({
        resolver: zodResolver(socialLinkSchema),
        defaultValues: {
            platform: "facebook",
            url: "",
            sort_order: 0,
            is_active: true,
        },
    });

    useEffect(() => {
        if (socialLinkToEdit) {
            reset({
                platform: socialLinkToEdit.platform,
                url: socialLinkToEdit.url,
                sort_order: socialLinkToEdit.sort_order,
                is_active: socialLinkToEdit.is_active,
            });
        }
    }, [socialLinkToEdit, reset]);

    const createMutation = useMutation({
        mutationFn: (data: SocialLinkFormData) => socialLinkApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["Social Link Table"] });
            queryClient.invalidateQueries({ queryKey: ["editor-social-links"] });
            toast.success("Social link created successfully");
            onClose();
        },
        onError: (error: any) => {
            setGeneralError(error?.message || "Failed to create social link");
        },
    });

    const updateMutation = useMutation({
        mutationFn: (data: SocialLinkFormData) =>
            socialLinkApi.update(socialLinkToEdit!.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["Social Link Table"] });
            queryClient.invalidateQueries({ queryKey: ["editor-social-links"] });
            queryClient.invalidateQueries({
                queryKey: ["social-link", socialLinkToEdit?.id],
            });
            toast.success("Social link updated successfully");
            onClose();
        },
        onError: (error: any) => {
            setGeneralError(error?.message || "Failed to update social link");
        },
    });

    const onSubmit = (data: SocialLinkFormData) => {
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
                name="platform"
                control={control}
                render={({ field }) => (
                    <FormSelect
                        label="Platform"
                        options={platformOptions}
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        error={errors.platform?.message}
                    />
                )}
            />

            <Controller
                name="url"
                control={control}
                render={({ field }) => (
                    <FormInput
                        label="URL"
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

export default SocialLinkForm;
