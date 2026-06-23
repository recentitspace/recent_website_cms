import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import Alert from "../../../components/Alert";
import MediaSelect from "../../../components/media/MediaSelect";
import FormAdvancedFields from "../../../components/form/FormAdvancedFields";
import FormFieldList from "../../../components/form/FormFieldList";
import FormFooter from "../../../components/form/FormFooter";
import FormInput from "../../../components/form/FormInput";
import FormSection from "../../../components/form/FormSection";
import FormTextarea from "../../../components/form/FormTextarea";
import FormToggle from "../../../components/form/FormToggle";
import { blogApi } from "../../../services/blog";
import { IBlog, IMedia } from "../../../types";

const blogSchema = z.object({
    title: z.string().min(1, "Title is required"),
    slug: z.string().optional(),
    excerpt: z.string().optional(),
    body_paragraphs: z.array(z.string()).optional(),
    author_name: z.string().optional(),
    featured_image_id: z.number().nullable().optional(),
    published_at: z.string().optional(),
    external_link: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    tags: z.string().optional(),
    sort_order: z.coerce.number().min(0).optional(),
    home_sort_order: z.coerce.number().min(0).optional().nullable(),
    is_active: z.boolean().optional(),
    show_on_home: z.boolean().optional(),
});

type BlogFormData = z.infer<typeof blogSchema>;

interface BlogFormProps {
    blogToEdit?: IBlog | null;
    onClose: () => void;
}

const parseTags = (value?: string) =>
    value
        ? value
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean)
        : [];

const BlogForm: React.FC<BlogFormProps> = ({ blogToEdit, onClose }) => {
    const queryClient = useQueryClient();
    const [generalError, setGeneralError] = useState<string | null>(null);
    const [featuredImage, setFeaturedImage] = useState<IMedia | null>(null);
    const isEditMode = Boolean(blogToEdit);

    const { data: fullBlog } = useQuery({
        queryKey: ["blog", blogToEdit?.id],
        queryFn: () => blogApi.getById(blogToEdit!.id),
        enabled: Boolean(blogToEdit?.id),
    });

    const editBlog = fullBlog || blogToEdit;

    const {
        control,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<BlogFormData>({
        resolver: zodResolver(blogSchema),
        defaultValues: {
            title: "",
            slug: "",
            excerpt: "",
            body_paragraphs: [],
            author_name: "",
            featured_image_id: null,
            published_at: "",
            external_link: "",
            tags: "",
            sort_order: 0,
            home_sort_order: 0,
            is_active: true,
            show_on_home: false,
        },
    });

    const showOnHome = watch("show_on_home");

    const { fields, append, remove } = useFieldArray({
        control,
        name: "body_paragraphs",
    });

    useEffect(() => {
        if (editBlog) {
            reset({
                title: editBlog.title,
                slug: editBlog.slug,
                excerpt: editBlog.excerpt || "",
                body_paragraphs: editBlog.body_paragraphs?.length ? editBlog.body_paragraphs : [],
                author_name: editBlog.author_name || "",
                featured_image_id: editBlog.featured_image_id || null,
                published_at: editBlog.published_at
                    ? editBlog.published_at.slice(0, 10)
                    : "",
                external_link: editBlog.external_link || "",
                tags: editBlog.tags?.join(", ") || "",
                sort_order: editBlog.sort_order,
                home_sort_order: editBlog.home_sort_order ?? 0,
                is_active: editBlog.is_active,
                show_on_home: editBlog.show_on_home,
            });
            setFeaturedImage(editBlog.featured_image || null);
            return;
        }

        reset({
            title: "",
            slug: "",
            excerpt: "",
            body_paragraphs: [],
            author_name: "",
            featured_image_id: null,
            published_at: "",
            external_link: "",
            tags: "",
            sort_order: 0,
            home_sort_order: 0,
            is_active: true,
            show_on_home: false,
        });
        setFeaturedImage(null);
    }, [editBlog, reset]);

    const invalidate = () => {
        queryClient.invalidateQueries({ queryKey: ["Blog Table"] });
        queryClient.invalidateQueries({ queryKey: ["editor-blogs"] });
    };

    const buildPayload = (data: BlogFormData) => ({
        ...data,
        slug: data.slug?.trim() || undefined,
        excerpt: data.excerpt?.trim() || null,
        author_name: data.author_name?.trim() || null,
        featured_image_id: data.featured_image_id || null,
        published_at: data.published_at?.trim() || null,
        external_link: data.external_link?.trim() || null,
        tags: parseTags(data.tags),
        body_paragraphs: data.body_paragraphs?.filter((paragraph) => paragraph.trim()) || [],
        home_sort_order: data.show_on_home ? data.home_sort_order ?? 0 : null,
    });

    const createMutation = useMutation({
        mutationFn: (data: BlogFormData) => blogApi.create(buildPayload(data)),
        onSuccess: () => {
            invalidate();
            toast.success("Blog post saved");
            onClose();
        },
        onError: (error: any) => {
            setGeneralError(error?.message || "Could not save blog post");
        },
    });

    const updateMutation = useMutation({
        mutationFn: (data: BlogFormData) =>
            blogApi.update(editBlog!.id, buildPayload(data)),
        onSuccess: () => {
            invalidate();
            queryClient.invalidateQueries({ queryKey: ["blog", editBlog?.id] });
            toast.success("Blog post updated");
            onClose();
        },
        onError: (error: any) => {
            setGeneralError(error?.message || "Could not update blog post");
        },
    });

    const onSubmit = (data: BlogFormData) => {
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
                title="Article basics"
                description="Title and short summary shown on cards and the blog listing."
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
                    name="slug"
                    control={control}
                    render={({ field }) => (
                        <FormInput
                            label="URL slug"
                            hint="Leave blank to generate from the title. Used for the article detail page."
                            value={field.value || ""}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            error={errors.slug?.message}
                        />
                    )}
                />

                <Controller
                    name="excerpt"
                    control={control}
                    render={({ field }) => (
                        <FormTextarea
                            id="blog-excerpt"
                            label="Short excerpt"
                            hint="Shown on the home carousel and blog cards."
                            value={field.value || ""}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            error={errors.excerpt?.message}
                            rows={3}
                        />
                    )}
                />

                <Controller
                    name="author_name"
                    control={control}
                    render={({ field }) => (
                        <FormInput
                            label="Author label"
                            hint='Shown above the date, e.g. "Recent-IT"'
                            value={field.value || ""}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            error={errors.author_name?.message}
                        />
                    )}
                />

                <Controller
                    name="published_at"
                    control={control}
                    render={({ field }) => (
                        <FormInput
                            label="Publish date"
                            type="date"
                            value={field.value || ""}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            error={errors.published_at?.message}
                        />
                    )}
                />
            </FormSection>

            <FormSection title="Cover image" description="Thumbnail shown on cards and article pages.">
                <Controller
                    name="featured_image_id"
                    control={control}
                    render={({ field }) => (
                        <MediaSelect
                            label="Featured image"
                            value={field.value}
                            selectedMedia={featuredImage}
                            onChange={(mediaId, media) => {
                                field.onChange(mediaId);
                                setFeaturedImage(media || null);
                            }}
                        />
                    )}
                />
            </FormSection>

            <FormSection
                title="Full article"
                description="Paragraphs for the blog detail page. Optional if this post only links elsewhere."
            >
                <FormFieldList
                    label="Body paragraphs"
                    addLabel="Add paragraph"
                    itemCount={fields.length}
                    onAdd={() => append("")}
                    onRemove={remove}
                    renderItem={(index) => (
                        <Controller
                            name={`body_paragraphs.${index}`}
                            control={control}
                            render={({ field }) => (
                                <FormTextarea
                                    id={`blog-body-${index}`}
                                    label={`Paragraph ${index + 1}`}
                                    value={field.value || ""}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    rows={4}
                                />
                            )}
                        />
                    )}
                />
            </FormSection>

            <FormSection
                title="Links"
                description="Use an external link when the full article lives on Facebook or another site."
            >
                <Controller
                    name="external_link"
                    control={control}
                    render={({ field }) => (
                        <FormInput
                            label="External read-more URL"
                            hint="When set, visitors open this URL instead of the on-site detail page."
                            value={field.value || ""}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            error={errors.external_link?.message}
                        />
                    )}
                />

                <Controller
                    name="tags"
                    control={control}
                    render={({ field }) => (
                        <FormInput
                            label="Tags"
                            hint="Comma-separated, e.g. SEO, Business, Marketing"
                            value={field.value || ""}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            error={errors.tags?.message}
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
                            label="Listing order"
                            type="number"
                            value={String(field.value ?? 0)}
                            onChange={(value) => field.onChange(Number(value))}
                            onBlur={field.onBlur}
                            error={errors.sort_order?.message}
                        />
                    )}
                />
                {showOnHome && (
                    <Controller
                        name="home_sort_order"
                        control={control}
                        render={({ field }) => (
                            <FormInput
                                label="Home carousel order"
                                type="number"
                                value={String(field.value ?? 0)}
                                onChange={(value) => field.onChange(Number(value))}
                                onBlur={field.onBlur}
                                error={errors.home_sort_order?.message}
                            />
                        )}
                    />
                )}
                <Controller
                    name="is_active"
                    control={control}
                    render={({ field }) => (
                        <FormToggle
                            label="Published on website"
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

export default BlogForm;
