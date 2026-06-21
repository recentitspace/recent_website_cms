import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Layers } from "lucide-react";
import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import Breadcrumb from "../../../components/Breadcrumb";
import FaqModal from "../../faq/components/FaqModal";
import ServiceCategoryModal from "../../service-category/components/ServiceCategoryModal";
import ServiceItemModal from "../../service-item/components/ServiceItemModal";
import { faqApi } from "../../../services/faq";
import { serviceCategoryApi } from "../../../services/serviceCategory";
import { serviceItemApi } from "../../../services/serviceItem";
import { IFaq, IServiceCategory, IServiceItem } from "../../../types";
import EditorActionButton from "../components/EditorActionButton";
import EditorEmptyState from "../components/EditorEmptyState";
import EditorLoadingState from "../components/EditorLoadingState";
import EditorPageShell from "../components/EditorPageShell";
import EditorPreviewField from "../components/EditorPreviewField";
import EditorSection from "../components/EditorSection";

const SERVICE_PAGE_LABELS: Record<string, string> = {
    "business-automation": "Business Automation",
    "business-presence": "Business Presence",
    "consulting-analyzing": "Consulting & Analyzing",
};

const ServiceCategoryEditorPage = () => {
    const { slug = "" } = useParams<{ slug: string }>();
    const queryClient = useQueryClient();
    const pageTitle = SERVICE_PAGE_LABELS[slug] || slug.replace(/-/g, " ");

    const [categoryModalOpen, setCategoryModalOpen] = useState(false);
    const [itemModalOpen, setItemModalOpen] = useState(false);
    const [faqModalOpen, setFaqModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<IServiceItem | null>(null);
    const [selectedFaq, setSelectedFaq] = useState<IFaq | null>(null);

    const { data: categoriesResponse, isLoading: categoriesLoading } = useQuery({
        queryKey: ["editor-service-category", slug],
        queryFn: () =>
            serviceCategoryApi.getAll({
                per_page: 100,
                sort_by: "sort_order",
                sort_direction: "asc",
            }),
    });

    const category = useMemo(
        () => categoriesResponse?.data?.find((entry) => entry.slug === slug) || null,
        [categoriesResponse?.data, slug]
    );

    const { data: itemsResponse, isLoading: itemsLoading } = useQuery({
        queryKey: ["editor-service-items", category?.id],
        queryFn: () =>
            serviceItemApi.getAll({
                per_page: 100,
                sort_by: "sort_order",
                sort_direction: "asc",
                filter: { service_category_id: String(category!.id) },
            }),
        enabled: Boolean(category?.id),
    });

    const { data: faqsResponse, isLoading: faqsLoading } = useQuery({
        queryKey: ["editor-category-faqs", category?.id],
        queryFn: () =>
            faqApi.getAll({
                per_page: 100,
                sort_by: "sort_order",
                sort_direction: "asc",
                filter: { service_category_id: String(category!.id) },
            }),
        enabled: Boolean(category?.id),
    });

    const items = itemsResponse?.data || [];
    const faqs = faqsResponse?.data || [];

    const refreshEditor = () => {
        queryClient.invalidateQueries({ queryKey: ["editor-service-category", slug] });
        if (category?.id) {
            queryClient.invalidateQueries({ queryKey: ["editor-service-items", category.id] });
            queryClient.invalidateQueries({ queryKey: ["editor-category-faqs", category.id] });
        }
    };

    const openEditCategory = () => setCategoryModalOpen(true);

    const openEditItem = (item: IServiceItem) => {
        setSelectedItem(item);
        setItemModalOpen(true);
    };

    const openEditFaq = (faq: IFaq) => {
        setSelectedFaq(faq);
        setFaqModalOpen(true);
    };

    const openAddItem = () => {
        setSelectedItem(null);
        setItemModalOpen(true);
    };

    const openAddFaq = () => {
        setSelectedFaq(null);
        setFaqModalOpen(true);
    };

    if (categoriesLoading) {
        return <EditorLoadingState message="Loading service page..." />;
    }

    if (!category) {
        return (
            <>
                <Breadcrumb
                    items={[
                        { title: "Dashboard", path: "/dashboard" },
                        { title: "Website Editor", path: "/editor" },
                        { title: pageTitle },
                    ]}
                />
                <EditorPageShell title={pageTitle} subtitle="This service page could not be found.">
                    <EditorEmptyState message="No service page matches this link." />
                </EditorPageShell>
            </>
        );
    }

    return (
        <>
            <Breadcrumb
                items={[
                    { title: "Dashboard", path: "/dashboard" },
                    { title: "Website Editor", path: "/editor" },
                    { title: pageTitle },
                ]}
            />

            <EditorPageShell
                title={pageTitle}
                subtitle="Everything visitors see on this service page — from the top banner to individual services and FAQs."
                icon={Layers}
                tip={
                    <>
                        Use <strong>Edit page header</strong> for the top banner and process
                        section. Each service has its own detail page you can edit separately.
                    </>
                }
            >
                <EditorSection
                    title="Page header"
                    description="The banner at the top — headline, intro text, image, and main button."
                    sectionNumber={1}
                    badge="Top of page"
                    action={
                        <EditorActionButton
                            label="Edit page header"
                            onClick={openEditCategory}
                            variant="primary"
                        />
                    }
                >
                    <div
                        className={`overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 via-white to-white dark:from-primary/10 dark:via-black dark:to-black ${
                            category.hero_image?.url ? "" : ""
                        }`}
                    >
                        {category.hero_image?.url && (
                            <img
                                src={category.hero_image.url}
                                alt={category.hero_title || category.title}
                                className="max-h-44 w-full object-cover"
                            />
                        )}
                        <div className="space-y-4 p-5">
                            <EditorPreviewField label="Headline">
                                {category.hero_title || category.title}
                            </EditorPreviewField>
                            {category.listing_subtitle && (
                                <EditorPreviewField label="Subheading" muted>
                                    {category.listing_subtitle}
                                </EditorPreviewField>
                            )}
                            {category.description && (
                                <EditorPreviewField label="Intro text" muted>
                                    <span className="whitespace-pre-wrap">{category.description}</span>
                                </EditorPreviewField>
                            )}
                            <EditorPreviewField label="Main button" muted>
                                <span className="inline-block rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-white">
                                    {category.cta_text || "Get started"}
                                </span>
                            </EditorPreviewField>
                        </div>
                    </div>
                </EditorSection>

                <EditorSection
                    title="How we work"
                    description="The step-by-step process section visitors see on this page."
                    sectionNumber={2}
                    action={
                        <EditorActionButton
                            label="Edit process steps"
                            onClick={openEditCategory}
                            variant="primary"
                        />
                    }
                >
                    {category.process_title && (
                        <EditorPreviewField label="Section title">
                            {category.process_title}
                        </EditorPreviewField>
                    )}
                    {category.process_subtitle && (
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                            {category.process_subtitle}
                        </p>
                    )}
                    {category.process_steps && category.process_steps.length > 0 ? (
                        <ol className="mt-4 space-y-3">
                            {category.process_steps.map((step, index) => (
                                <li
                                    key={`${step.title}-${index}`}
                                    className="flex gap-3 rounded-xl border border-white-dark/20 bg-white-light/30 p-4 dark:border-white/10 dark:bg-white/5"
                                >
                                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                                        {index + 1}
                                    </span>
                                    <div>
                                        <p className="font-semibold text-gray-900 dark:text-white">
                                            {step.title}
                                        </p>
                                        {step.description && (
                                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                                                {step.description}
                                            </p>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ol>
                    ) : (
                        <EditorEmptyState
                            message="No process steps yet."
                            hint="Add steps that explain how you deliver this service."
                            onAction={openEditCategory}
                            actionLabel="Add process steps"
                        />
                    )}
                </EditorSection>

                <EditorSection
                    title="Services in this group"
                    description="Each card links to its own detail page with more information."
                    sectionNumber={3}
                    action={
                        <EditorActionButton
                            label="Add service"
                            onClick={openAddItem}
                            variant="primary"
                        />
                    }
                >
                    {itemsLoading ? (
                        <EditorLoadingState message="Loading services..." />
                    ) : items.length === 0 ? (
                        <EditorEmptyState
                            message="No services in this group yet."
                            hint="Add a service with a title, page link, and highlights."
                            onAction={openAddItem}
                            actionLabel="Add first service"
                        />
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex flex-col justify-between gap-4 rounded-xl border border-white-dark/20 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-black/40"
                                >
                                    <div>
                                        <p className="font-semibold text-gray-900 dark:text-white">
                                            {item.title}
                                        </p>
                                        {item.detail_hero_title && (
                                            <p className="mt-1 text-sm text-gray-500">
                                                Detail page: {item.detail_hero_title}
                                            </p>
                                        )}
                                        {item.highlights && item.highlights.length > 0 && (
                                            <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-300">
                                                {item.highlights.slice(0, 3).map((highlight) => (
                                                    <li key={highlight} className="flex gap-2">
                                                        <span className="text-primary">•</span>
                                                        {highlight}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                    <div className="flex justify-end">
                                        <EditorActionButton
                                            label="Edit service"
                                            onClick={() => openEditItem(item)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </EditorSection>

                <EditorSection
                    title="Questions visitors ask"
                    description="FAQ accordion shown at the bottom of this service page."
                    sectionNumber={4}
                    action={
                        <EditorActionButton
                            label="Add question"
                            onClick={openAddFaq}
                            variant="primary"
                        />
                    }
                >
                    {faqsLoading ? (
                        <EditorLoadingState message="Loading questions..." />
                    ) : faqs.length === 0 ? (
                        <EditorEmptyState
                            message="No questions for this page yet."
                            hint="Add common questions visitors ask about this service."
                            onAction={openAddFaq}
                            actionLabel="Add first question"
                        />
                    ) : (
                        <div className="grid gap-3 md:grid-cols-2">
                            {faqs.map((faq) => (
                                <div
                                    key={faq.id}
                                    className="flex flex-col justify-between gap-4 rounded-xl border border-white-dark/20 bg-white-light/30 p-4 dark:border-white/10 dark:bg-white/5"
                                >
                                    <div>
                                        <p className="font-semibold text-gray-900 dark:text-white">
                                            {faq.question}
                                        </p>
                                        <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                                            {faq.answer_paragraphs?.[0]}
                                        </p>
                                    </div>
                                    <div className="flex justify-end">
                                        <EditorActionButton
                                            label="Edit answer"
                                            onClick={() => openEditFaq(faq)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </EditorSection>
            </EditorPageShell>

            <ServiceCategoryModal
                isOpen={categoryModalOpen}
                setIsOpen={(open) => {
                    setCategoryModalOpen(open);
                    if (!open) {
                        refreshEditor();
                    }
                }}
                categoryToEdit={category as IServiceCategory}
            />

            <ServiceItemModal
                isOpen={itemModalOpen}
                setIsOpen={(open) => {
                    setItemModalOpen(open);
                    if (!open) {
                        setSelectedItem(null);
                        refreshEditor();
                    }
                }}
                itemToEdit={selectedItem}
                defaultServiceCategoryId={category.id}
            />

            <FaqModal
                isOpen={faqModalOpen}
                setIsOpen={(open) => {
                    setFaqModalOpen(open);
                    if (!open) {
                        setSelectedFaq(null);
                        refreshEditor();
                    }
                }}
                faqToEdit={selectedFaq}
                defaultServiceCategoryId={category.id}
            />
        </>
    );
};

export default ServiceCategoryEditorPage;
