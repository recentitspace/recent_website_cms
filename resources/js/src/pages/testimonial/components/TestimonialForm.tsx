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
import FormTextarea from "../../../components/form/FormTextarea";
import { testimonialApi } from "../../../services/testimonial";
import { IMedia, ITestimonial } from "../../../types";

const testimonialSchema = z.object({
    quote: z.string().min(1, "Quote is required"),
    author_name: z.string().min(1, "Author name is required"),
    author_role: z.string().optional(),
    logo_light_id: z.number().nullable().optional(),
    logo_dark_id: z.number().nullable().optional(),
    avatar_id: z.number().nullable().optional(),
    sort_order: z.coerce.number().min(0).optional(),
    is_active: z.boolean().optional(),
    show_on_home: z.boolean().optional(),
});

type TestimonialFormData = z.infer<typeof testimonialSchema>;

interface TestimonialFormProps {
    testimonialToEdit?: ITestimonial | null;
    onClose: () => void;
}

const TestimonialForm: React.FC<TestimonialFormProps> = ({ testimonialToEdit, onClose }) => {
    const queryClient = useQueryClient();
    const [generalError, setGeneralError] = useState<string | null>(null);
    const [logoLight, setLogoLight] = useState<IMedia | null>(null);
    const [logoDark, setLogoDark] = useState<IMedia | null>(null);
    const [avatar, setAvatar] = useState<IMedia | null>(null);
    const isEditMode = Boolean(testimonialToEdit);

    const { data: fullTestimonial } = useQuery({
        queryKey: ["testimonial", testimonialToEdit?.id],
        queryFn: () => testimonialApi.getById(testimonialToEdit!.id),
        enabled: Boolean(testimonialToEdit?.id),
    });

    const editTestimonial = fullTestimonial || testimonialToEdit;

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<TestimonialFormData>({
        resolver: zodResolver(testimonialSchema),
        defaultValues: {
            quote: "",
            author_name: "",
            author_role: "",
            logo_light_id: null,
            logo_dark_id: null,
            avatar_id: null,
            sort_order: 0,
            is_active: true,
            show_on_home: true,
        },
    });

    useEffect(() => {
        if (editTestimonial) {
            reset({
                quote: editTestimonial.quote,
                author_name: editTestimonial.author_name,
                author_role: editTestimonial.author_role || "",
                logo_light_id: editTestimonial.logo_light_id || null,
                logo_dark_id: editTestimonial.logo_dark_id || null,
                avatar_id: editTestimonial.avatar_id || null,
                sort_order: editTestimonial.sort_order,
                is_active: editTestimonial.is_active,
                show_on_home: editTestimonial.show_on_home,
            });
            setLogoLight(editTestimonial.logo_light || null);
            setLogoDark(editTestimonial.logo_dark || null);
            setAvatar(editTestimonial.avatar || null);
        }
    }, [editTestimonial, reset]);

    const createMutation = useMutation({
        mutationFn: (data: TestimonialFormData) =>
            testimonialApi.create({
                ...data,
                author_role: data.author_role || null,
                logo_light_id: data.logo_light_id || null,
                logo_dark_id: data.logo_dark_id || null,
                avatar_id: data.avatar_id || null,
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["Testimonial Table"] });
            toast.success("Testimonial created successfully");
            onClose();
        },
        onError: (error: any) => {
            setGeneralError(error?.message || "Failed to create testimonial");
        },
    });

    const updateMutation = useMutation({
        mutationFn: (data: TestimonialFormData) =>
            testimonialApi.update(editTestimonial!.id, {
                ...data,
                author_role: data.author_role || null,
                logo_light_id: data.logo_light_id || null,
                logo_dark_id: data.logo_dark_id || null,
                avatar_id: data.avatar_id || null,
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["Testimonial Table"] });
            queryClient.invalidateQueries({ queryKey: ["testimonial", editTestimonial?.id] });
            toast.success("Testimonial updated successfully");
            onClose();
        },
        onError: (error: any) => {
            setGeneralError(error?.message || "Failed to update testimonial");
        },
    });

    const onSubmit = (data: TestimonialFormData) => {
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
                name="quote"
                control={control}
                render={({ field }) => (
                    <FormTextarea
                        label="Quote"
                        value={field.value || ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        error={errors.quote?.message}
                        rows={4}
                    />
                )}
            />

            <Controller
                name="author_name"
                control={control}
                render={({ field }) => (
                    <FormInput
                        label="Author Name"
                        value={field.value || ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        error={errors.author_name?.message}
                    />
                )}
            />

            <Controller
                name="author_role"
                control={control}
                render={({ field }) => (
                    <FormInput
                        label="Author Role"
                        value={field.value || ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        error={errors.author_role?.message}
                    />
                )}
            />

            <Controller
                name="logo_light_id"
                control={control}
                render={({ field }) => (
                    <MediaSelect
                        label="Company Logo (light theme)"
                        value={field.value}
                        selectedMedia={logoLight}
                        onChange={(mediaId, media) => {
                            field.onChange(mediaId);
                            setLogoLight(media || null);
                        }}
                    />
                )}
            />

            <Controller
                name="logo_dark_id"
                control={control}
                render={({ field }) => (
                    <MediaSelect
                        label="Company Logo (dark theme)"
                        value={field.value}
                        selectedMedia={logoDark}
                        onChange={(mediaId, media) => {
                            field.onChange(mediaId);
                            setLogoDark(media || null);
                        }}
                    />
                )}
            />

            <Controller
                name="avatar_id"
                control={control}
                render={({ field }) => (
                    <MediaSelect
                        label="Author Avatar"
                        value={field.value}
                        selectedMedia={avatar}
                        onChange={(mediaId, media) => {
                            field.onChange(mediaId);
                            setAvatar(media || null);
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

export default TestimonialForm;
