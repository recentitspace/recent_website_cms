import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LayoutTemplate } from "lucide-react";
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
import FormSelect from "../../../components/form/FormSelect";
import FormTextarea from "../../../components/form/FormTextarea";
import FormToggle from "../../../components/form/FormToggle";
import { useSimpleFormMode } from "../../../hooks/useSimpleFormMode";
import { pageBlockApi } from "../../../services/pageBlock";
import { IMedia, IPageBlock, PageName } from "../../../types";

const pageOptions = [
    { value: "home", label: "Home" },
    { value: "about", label: "About" },
    { value: "faq", label: "FAQ" },
    { value: "contact", label: "Contact" },
    { value: "pricing", label: "Pricing" },
];

const pageBlockSchema = z.object({
    page: z.enum(["home", "about", "faq", "contact", "pricing"]),
    key: z.string().min(1, "Key is required"),
    title: z.string().optional(),
    subtitle: z.string().optional(),
    body: z.string().optional(),
    image_id: z.number().nullable().optional(),
    cta_text: z.string().optional(),
    cta_url: z.string().optional().or(z.literal("")),
    cta_secondary_text: z.string().optional(),
    cta_secondary_url: z.string().optional().or(z.literal("")),
    video_url: z.string().optional().or(z.literal("")),
    is_active: z.boolean().optional(),
});

type PageBlockFormData = z.infer<typeof pageBlockSchema>;

interface PageBlockFormProps {
    blockToEdit?: IPageBlock | null;
    onClose: () => void;
}

const PageBlockForm: React.FC<PageBlockFormProps> = ({ blockToEdit, onClose }) => {
    const queryClient = useQueryClient();
    const simpleMode = useSimpleFormMode();
    const [generalError, setGeneralError] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<IMedia | null>(null);
    const isEditMode = Boolean(blockToEdit);

    const { data: fullBlock } = useQuery({
        queryKey: ["page-block", blockToEdit?.id],
        queryFn: () => pageBlockApi.getById(blockToEdit!.id),
        enabled: Boolean(blockToEdit?.id),
    });

    const editBlock = fullBlock || blockToEdit;

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<PageBlockFormData>({
        resolver: zodResolver(pageBlockSchema),
        defaultValues: {
            page: "home",
            key: "",
            title: "",
            subtitle: "",
            body: "",
            image_id: null,
            cta_text: "",
            cta_url: "",
            cta_secondary_text: "",
            cta_secondary_url: "",
            video_url: "",
            is_active: true,
        },
    });

    useEffect(() => {
        if (editBlock) {
            reset({
                page: editBlock.page as PageName,
                key: editBlock.key,
                title: editBlock.title || "",
                subtitle: editBlock.subtitle || "",
                body: editBlock.body || "",
                image_id: editBlock.image_id || null,
                cta_text: editBlock.cta_text || "",
                cta_url: editBlock.cta_url || "",
                cta_secondary_text: editBlock.cta_secondary_text || "",
                cta_secondary_url: editBlock.cta_secondary_url || "",
                video_url: editBlock.video_url || "",
                is_active: editBlock.is_active,
            });
            setSelectedImage(editBlock.image || null);
        }
    }, [editBlock, reset]);

    const invalidate = () => {
        queryClient.invalidateQueries({ queryKey: ["Page Block Table"] });
        queryClient.invalidateQueries({ queryKey: ["Page Blocks Select"] });
        queryClient.invalidateQueries({ queryKey: ["editor-page-blocks"] });
    };

    const createMutation = useMutation({
        mutationFn: (data: PageBlockFormData) =>
            pageBlockApi.create({
                ...data,
                title: data.title?.trim() || null,
                subtitle: data.subtitle?.trim() || null,
                body: data.body?.trim() || null,
                image_id: data.image_id || null,
                cta_text: data.cta_text?.trim() || null,
                cta_url: data.cta_url?.trim() || null,
                cta_secondary_text: data.cta_secondary_text?.trim() || null,
                cta_secondary_url: data.cta_secondary_url?.trim() || null,
                video_url: data.video_url?.trim() || null,
            }),
        onSuccess: () => {
            invalidate();
            toast.success("Section saved");
            onClose();
        },
        onError: (error: any) => {
            setGeneralError(error?.message || "Could not save this section");
        },
    });

    const updateMutation = useMutation({
        mutationFn: (data: PageBlockFormData) =>
            pageBlockApi.update(editBlock!.id, {
                ...data,
                title: data.title?.trim() || null,
                subtitle: data.subtitle?.trim() || null,
                body: data.body?.trim() || null,
                image_id: data.image_id || null,
                cta_text: data.cta_text?.trim() || null,
                cta_url: data.cta_url?.trim() || null,
                cta_secondary_text: data.cta_secondary_text?.trim() || null,
                cta_secondary_url: data.cta_secondary_url?.trim() || null,
                video_url: data.video_url?.trim() || null,
            }),
        onSuccess: () => {
            invalidate();
            queryClient.invalidateQueries({ queryKey: ["page-block", editBlock?.id] });
            toast.success("Section updated");
            onClose();
        },
        onError: (error: any) => {
            setGeneralError(error?.message || "Could not update this section");
        },
    });

    const onSubmit = (data: PageBlockFormData) => {
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
                title="Main text"
                description="The headline and paragraphs visitors read in this section."
            >
                <Controller
                    name="title"
                    control={control}
                    render={({ field }) => (
                        <FormInput
                            label="Headline"
                            hint="The big title visitors see first."
                            value={field.value || ""}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            error={errors.title?.message}
                        />
                    )}
                />

                <Controller
                    name="subtitle"
                    control={control}
                    render={({ field }) => (
                        <FormInput
                            label="Subheading"
                            hint="A shorter line below the headline (optional)."
                            value={field.value || ""}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            error={errors.subtitle?.message}
                        />
                    )}
                />

                <Controller
                    name="body"
                    control={control}
                    render={({ field }) => (
                        <FormTextarea
                            id="page-block-body"
                            label="Main text"
                            hint="Longer description or story text for this section."
                            value={field.value || ""}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            error={errors.body?.message}
                            rows={4}
                        />
                    )}
                />
            </FormSection>

            <FormSection title="Image" description="Photo or graphic shown in this section.">
                <Controller
                    name="image_id"
                    control={control}
                    render={({ field }) => (
                        <MediaSelect
                            label="Section image"
                            value={field.value}
                            selectedMedia={selectedImage}
                            onChange={(mediaId, media) => {
                                field.onChange(mediaId);
                                setSelectedImage(media || null);
                            }}
                        />
                    )}
                />
            </FormSection>

            <FormSection
                title="Buttons"
                description="Call-to-action buttons that link visitors to other pages."
            >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Controller
                        name="cta_text"
                        control={control}
                        render={({ field }) => (
                            <FormInput
                                label="Primary button text"
                                hint='e.g. "Get started"'
                                value={field.value || ""}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                error={errors.cta_text?.message}
                            />
                        )}
                    />
                    <Controller
                        name="cta_url"
                        control={control}
                        render={({ field }) => (
                            <FormInput
                                label="Primary button link"
                                hint="Page URL or /contact"
                                value={field.value || ""}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                error={errors.cta_url?.message}
                            />
                        )}
                    />
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Controller
                        name="cta_secondary_text"
                        control={control}
                        render={({ field }) => (
                            <FormInput
                                label="Secondary button text"
                                value={field.value || ""}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                error={errors.cta_secondary_text?.message}
                            />
                        )}
                    />
                    <Controller
                        name="cta_secondary_url"
                        control={control}
                        render={({ field }) => (
                            <FormInput
                                label="Secondary button link"
                                value={field.value || ""}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                error={errors.cta_secondary_url?.message}
                            />
                        )}
                    />
                </div>
            </FormSection>

            <FormSection title="Video" description="Optional embedded video for this section.">
                <Controller
                    name="video_url"
                    control={control}
                    render={({ field }) => (
                        <FormInput
                            label="Video link"
                            hint="YouTube or Vimeo URL"
                            value={field.value || ""}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            error={errors.video_url?.message}
                            placeholder="https://..."
                        />
                    )}
                />
            </FormSection>

            <FormAdvancedFields>
                {!simpleMode || !isEditMode ? (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <Controller
                            name="page"
                            control={control}
                            render={({ field }) => (
                                <FormSelect
                                    label="Page"
                                    options={pageOptions}
                                    value={field.value}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    error={errors.page?.message}
                                />
                            )}
                        />
                        <Controller
                            name="key"
                            control={control}
                            render={({ field }) => (
                                <FormInput
                                    label="Section key"
                                    value={field.value || ""}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    error={errors.key?.message}
                                    placeholder="e.g. home_hero"
                                />
                            )}
                        />
                    </div>
                ) : null}

                <Controller
                    name="is_active"
                    control={control}
                    render={({ field }) => (
                        <FormToggle
                            label="Show on website"
                            description="Turn off to hide this section without deleting it."
                            checked={field.value ?? true}
                            onChange={field.onChange}
                        />
                    )}
                />
            </FormAdvancedFields>

            <FormFooter
                onCancel={onClose}
                isSubmitting={isSubmitting}
                isEditMode={isEditMode}
            />
        </form>
    );
};

export default PageBlockForm;
