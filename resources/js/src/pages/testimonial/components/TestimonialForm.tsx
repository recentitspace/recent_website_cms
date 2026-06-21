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
import FormTextarea from "../../../components/form/FormTextarea";
import FormToggle from "../../../components/form/FormToggle";
import { testimonialApi } from "../../../services/testimonial";
import { IMedia, ITestimonial } from "../../../types";

const testimonialSchema = z.object({
    quote: z.string().min(1, "Quote is required"),
    author_name: z.string().min(1, "Name is required"),
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

    const invalidate = () => {
        queryClient.invalidateQueries({ queryKey: ["Testimonial Table"] });
        queryClient.invalidateQueries({ queryKey: ["editor-home-testimonials"] });
    };

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
            invalidate();
            toast.success("Testimonial saved");
            onClose();
        },
        onError: (error: any) => {
            setGeneralError(error?.message || "Could not save testimonial");
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
            invalidate();
            queryClient.invalidateQueries({ queryKey: ["testimonial", editTestimonial?.id] });
            toast.success("Testimonial updated");
            onClose();
        },
        onError: (error: any) => {
            setGeneralError(error?.message || "Could not update testimonial");
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

            <FormSection
                title="The quote"
                description="What the client said about your work."
            >
                <Controller
                    name="quote"
                    control={control}
                    render={({ field }) => (
                        <FormTextarea
                            id="testimonial-quote"
                            label="Client quote"
                            hint="Write the testimonial in their own words."
                            value={field.value || ""}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            error={errors.quote?.message}
                            rows={4}
                        />
                    )}
                />
            </FormSection>

            <FormSection title="Who said it" description="Name and role shown under the quote.">
                <Controller
                    name="author_name"
                    control={control}
                    render={({ field }) => (
                        <FormInput
                            label="Person's name"
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
                            label="Their role or company"
                            hint='e.g. "CEO, Acme Corp"'
                            value={field.value || ""}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            error={errors.author_role?.message}
                        />
                    )}
                />
            </FormSection>

            <FormSection title="Photos" description="Optional images shown with the testimonial.">
                <Controller
                    name="avatar_id"
                    control={control}
                    render={({ field }) => (
                        <MediaSelect
                            label="Person's photo"
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
                    name="logo_light_id"
                    control={control}
                    render={({ field }) => (
                        <MediaSelect
                            label="Company logo (light background)"
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
                            label="Company logo (dark background)"
                            value={field.value}
                            selectedMedia={logoDark}
                            onChange={(mediaId, media) => {
                                field.onChange(mediaId);
                                setLogoDark(media || null);
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

export default TestimonialForm;
