import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import ActionButton from "../../components/ActionButton";
import Alert from "../../components/Alert";
import Breadcrumb from "../../components/Breadcrumb";
import FormInput from "../../components/form/FormInput";
import MediaSelect from "../../components/media/MediaSelect";
import { siteSettingApi } from "../../services/siteSetting";
import { IMedia } from "../../types";

const siteSettingSchema = z.object({
    site_name: z.string().max(255).optional().nullable(),
    tagline: z.string().max(500).optional().nullable(),
    copyright_text: z.string().max(255).optional().nullable(),
    whatsapp_number: z.string().max(30).optional().nullable(),
    whatsapp_label: z.string().max(100).optional().nullable(),
    contact_email: z.string().email("Invalid email").optional().or(z.literal("")).nullable(),
    phone: z.string().max(30).optional().nullable(),
    address: z.string().max(500).optional().nullable(),
    notification_email: z.string().email("Invalid email").optional().or(z.literal("")).nullable(),
    logo_light_id: z.number().nullable().optional(),
    logo_dark_id: z.number().nullable().optional(),
    favicon_id: z.number().nullable().optional(),
});

type SiteSettingFormData = z.infer<typeof siteSettingSchema>;

const SiteSettingsPage = () => {
    const queryClient = useQueryClient();
    const [generalError, setGeneralError] = useState<string | null>(null);
    const [logoLight, setLogoLight] = useState<IMedia | null>(null);
    const [logoDark, setLogoDark] = useState<IMedia | null>(null);
    const [favicon, setFavicon] = useState<IMedia | null>(null);

    const { data: settings, isLoading } = useQuery({
        queryKey: ["site-settings"],
        queryFn: () => siteSettingApi.get(),
    });

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<SiteSettingFormData>({
        resolver: zodResolver(siteSettingSchema),
        defaultValues: {},
    });

    useEffect(() => {
        if (settings) {
            reset({
                site_name: settings.site_name || "",
                tagline: settings.tagline || "",
                copyright_text: settings.copyright_text || "",
                whatsapp_number: settings.whatsapp_number || "",
                whatsapp_label: settings.whatsapp_label || "",
                contact_email: settings.contact_email || "",
                phone: settings.phone || "",
                address: settings.address || "",
                notification_email: settings.notification_email || "",
                logo_light_id: settings.logo_light_id ?? null,
                logo_dark_id: settings.logo_dark_id ?? null,
                favicon_id: settings.favicon_id ?? null,
            });
            setLogoLight(settings.logo_light || null);
            setLogoDark(settings.logo_dark || null);
            setFavicon(settings.favicon || null);
        }
    }, [settings, reset]);

    const updateMutation = useMutation({
        mutationFn: (data: SiteSettingFormData) => siteSettingApi.update(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["site-settings"] });
            toast.success("Site settings saved successfully");
        },
        onError: (error: any) => {
            setGeneralError(error?.message || "Failed to save site settings");
        },
    });

    const onSubmit = (data: SiteSettingFormData) => {
        setGeneralError(null);
        updateMutation.mutate({
            ...data,
            contact_email: data.contact_email || null,
            notification_email: data.notification_email || null,
        });
    };

    const breadcrumbItems = [
        { title: "Dashboard", path: "/dashboard" },
        { title: "Site Settings" },
    ];

    if (isLoading) {
        return null;
    }

    return (
        <div>
            <Breadcrumb items={breadcrumbItems} />

            <div className="panel mt-5">
                <h5 className="mb-5 text-lg font-semibold">Website Site Settings</h5>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {generalError && <Alert type="danger" message={generalError} />}

                    <div className="grid gap-5 md:grid-cols-2">
                        <Controller
                            name="site_name"
                            control={control}
                            render={({ field }) => (
                                <FormInput
                                    label="Site Name"
                                    value={field.value || ""}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    error={errors.site_name?.message}
                                />
                            )}
                        />
                        <Controller
                            name="copyright_text"
                            control={control}
                            render={({ field }) => (
                                <FormInput
                                    label="Copyright Text"
                                    value={field.value || ""}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    error={errors.copyright_text?.message}
                                />
                            )}
                        />
                    </div>

                    <Controller
                        name="tagline"
                        control={control}
                        render={({ field }) => (
                            <FormInput
                                label="Tagline"
                                value={field.value || ""}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                error={errors.tagline?.message}
                            />
                        )}
                    />

                    <div className="grid gap-5 md:grid-cols-2">
                        <Controller
                            name="contact_email"
                            control={control}
                            render={({ field }) => (
                                <FormInput
                                    label="Contact Email"
                                    type="email"
                                    value={field.value || ""}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    error={errors.contact_email?.message}
                                />
                            )}
                        />
                        <Controller
                            name="notification_email"
                            control={control}
                            render={({ field }) => (
                                <FormInput
                                    label="Form Notification Email"
                                    type="email"
                                    value={field.value || ""}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    error={errors.notification_email?.message}
                                />
                            )}
                        />
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                        <Controller
                            name="phone"
                            control={control}
                            render={({ field }) => (
                                <FormInput
                                    label="Phone"
                                    value={field.value || ""}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    error={errors.phone?.message}
                                />
                            )}
                        />
                        <Controller
                            name="whatsapp_number"
                            control={control}
                            render={({ field }) => (
                                <FormInput
                                    label="WhatsApp Number"
                                    value={field.value || ""}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    error={errors.whatsapp_number?.message}
                                />
                            )}
                        />
                    </div>

                    <Controller
                        name="whatsapp_label"
                        control={control}
                        render={({ field }) => (
                            <FormInput
                                label="WhatsApp Button Label"
                                value={field.value || ""}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                error={errors.whatsapp_label?.message}
                            />
                        )}
                    />

                    <Controller
                        name="address"
                        control={control}
                        render={({ field }) => (
                            <FormInput
                                label="Address"
                                value={field.value || ""}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                error={errors.address?.message}
                            />
                        )}
                    />

                    <div className="grid gap-5 md:grid-cols-3">
                        <Controller name="logo_light_id" control={control} render={() => <></>} />
                        <Controller name="logo_dark_id" control={control} render={() => <></>} />
                        <Controller name="favicon_id" control={control} render={() => <></>} />
                        <MediaSelect
                            label="Logo (Light)"
                            value={logoLight?.id}
                            selectedMedia={logoLight}
                            onChange={(id, media) => {
                                setValue("logo_light_id", id);
                                setLogoLight(media || null);
                            }}
                        />
                        <MediaSelect
                            label="Logo (Dark)"
                            value={logoDark?.id}
                            selectedMedia={logoDark}
                            onChange={(id, media) => {
                                setValue("logo_dark_id", id);
                                setLogoDark(media || null);
                            }}
                        />
                        <MediaSelect
                            label="Favicon"
                            value={favicon?.id}
                            selectedMedia={favicon}
                            onChange={(id, media) => {
                                setValue("favicon_id", id);
                                setFavicon(media || null);
                            }}
                        />
                    </div>

                    <div className="flex justify-end pt-4">
                        <ActionButton
                            type="submit"
                            variant="primary"
                            isLoading={isSubmitting || updateMutation.isPending}
                            loadingText="Saving..."
                            displayText="Save Settings"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SiteSettingsPage;
