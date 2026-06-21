import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DollarSign } from "lucide-react";
import React, { useState } from "react";

import Breadcrumb from "../../components/Breadcrumb";
import PricingPlanModal from "../pricing-plan/components/PricingPlanModal";
import PricingSectionModal from "../pricing-section/components/PricingSectionModal";
import { pricingPlanApi } from "../../services/pricingPlan";
import { pricingSectionApi } from "../../services/pricingSection";
import { IPricingPlan, IPricingSection } from "../../types";
import EditorActionButton from "./components/EditorActionButton";
import EditorEmptyState from "./components/EditorEmptyState";
import EditorLoadingState from "./components/EditorLoadingState";
import EditorPageShell from "./components/EditorPageShell";
import EditorSection from "./components/EditorSection";

const EditorPricingPage = () => {
    const queryClient = useQueryClient();
    const [sectionModalOpen, setSectionModalOpen] = useState(false);
    const [planModalOpen, setPlanModalOpen] = useState(false);
    const [selectedSection, setSelectedSection] = useState<IPricingSection | null>(null);
    const [selectedPlan, setSelectedPlan] = useState<IPricingPlan | null>(null);
    const [defaultSectionId, setDefaultSectionId] = useState<number | null>(null);

    const openAddSection = () => {
        setSelectedSection(null);
        setSectionModalOpen(true);
    };

    const { data: sectionsResponse, isLoading } = useQuery({
        queryKey: ["editor-pricing-sections"],
        queryFn: () =>
            pricingSectionApi.getAll({
                per_page: 100,
                sort_by: "sort_order",
                sort_direction: "asc",
            }),
    });

    const sections = sectionsResponse?.data || [];

    const refresh = () => {
        queryClient.invalidateQueries({ queryKey: ["editor-pricing-sections"] });
        sections.forEach((section) => {
            queryClient.invalidateQueries({ queryKey: ["editor-pricing-plans", section.id] });
        });
    };

    return (
        <>
            <Breadcrumb
                items={[
                    { title: "Dashboard", path: "/dashboard" },
                    { title: "Website Editor", path: "/editor" },
                    { title: "Pricing" },
                ]}
            />

            <EditorPageShell
                title="Pricing"
                subtitle="Organize your pricing into categories, then add the plans visitors can compare and choose from."
                icon={DollarSign}
                tip={
                    <>
                        Each <strong>category</strong> is a group on the pricing page (for example
                        &ldquo;Web Design&rdquo;). Inside each category, add <strong>plans</strong>{" "}
                        with a name, price, and list of features.
                    </>
                }
            >
                {isLoading ? (
                    <EditorLoadingState message="Loading pricing categories..." />
                ) : sections.length === 0 ? (
                    <EditorEmptyState
                        message="No pricing categories yet."
                        hint="Create a category first, then add plans inside it."
                        onAction={openAddSection}
                        actionLabel="Add category"
                    />
                ) : (
                    sections.map((section, index) => (
                        <PricingSectionBlock
                            key={section.id}
                            section={section}
                            sectionNumber={index + 1}
                            onEditSection={() => {
                                setSelectedSection(section);
                                setSectionModalOpen(true);
                            }}
                            onEditPlan={(plan) => {
                                setSelectedPlan(plan);
                                setDefaultSectionId(null);
                                setPlanModalOpen(true);
                            }}
                            onAddPlan={() => {
                                setSelectedPlan(null);
                                setDefaultSectionId(section.id);
                                setPlanModalOpen(true);
                            }}
                        />
                    ))
                )}
            </EditorPageShell>

            <PricingSectionModal
                isOpen={sectionModalOpen}
                setIsOpen={(open) => {
                    setSectionModalOpen(open);
                    if (!open) {
                        setSelectedSection(null);
                        refresh();
                    }
                }}
                sectionToEdit={selectedSection}
            />

            <PricingPlanModal
                isOpen={planModalOpen}
                setIsOpen={(open) => {
                    setPlanModalOpen(open);
                    if (!open) {
                        setSelectedPlan(null);
                        setDefaultSectionId(null);
                        refresh();
                    }
                }}
                planToEdit={selectedPlan}
                defaultPricingSectionId={defaultSectionId}
            />
        </>
    );
};

interface PricingSectionBlockProps {
    section: IPricingSection;
    sectionNumber: number;
    onEditSection: () => void;
    onEditPlan: (plan: IPricingPlan) => void;
    onAddPlan: () => void;
}

const PricingSectionBlock: React.FC<PricingSectionBlockProps> = ({
    section,
    sectionNumber,
    onEditSection,
    onEditPlan,
    onAddPlan,
}) => {
    const { data: plansResponse, isLoading } = useQuery({
        queryKey: ["editor-pricing-plans", section.id],
        queryFn: () =>
            pricingPlanApi.getAll({
                per_page: 100,
                sort_by: "sort_order",
                sort_direction: "asc",
                filter: { pricing_section_id: String(section.id) },
            }),
    });

    const plans = plansResponse?.data || [];

    return (
        <EditorSection
            title={section.title}
            description={section.subtitle || "Plans visitors can choose in this category."}
            sectionNumber={sectionNumber}
            action={
                <div className="flex flex-wrap gap-2">
                    <EditorActionButton label="Add plan" onClick={onAddPlan} />
                    <EditorActionButton
                        label="Edit category"
                        onClick={onEditSection}
                        variant="primary"
                    />
                </div>
            }
        >
            {isLoading ? (
                <EditorLoadingState message="Loading plans..." />
            ) : plans.length === 0 ? (
                <EditorEmptyState
                    message="No plans in this category yet."
                    hint="Add your first plan with a name, price, and feature list."
                    onAction={onAddPlan}
                    actionLabel="Add first plan"
                />
            ) : (
                <div className="grid gap-4 md:grid-cols-2">
                        {plans.map((plan) => (
                            <div
                                key={plan.id}
                                className="flex flex-col justify-between gap-4 rounded-xl border border-white-dark/20 bg-gradient-to-br from-white to-primary/5 p-5 shadow-sm dark:border-white/10 dark:from-black dark:to-primary/10"
                            >
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white">
                                        {plan.name}
                                    </p>
                                    <p className="mt-1 text-2xl font-bold text-primary">
                                        {plan.price}
                                        {plan.price_period && (
                                            <span className="text-sm font-normal text-gray-500">
                                                {" "}
                                                / {plan.price_period}
                                            </span>
                                        )}
                                    </p>
                                    {plan.features && plan.features.length > 0 && (
                                        <ul className="mt-3 space-y-1.5 text-sm text-gray-600 dark:text-gray-300">
                                            {plan.features.slice(0, 5).map((feature) => (
                                                <li key={feature.text} className="flex gap-2">
                                                    <span className="text-primary">✓</span>
                                                    {feature.text}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                                <div className="flex justify-end">
                                    <EditorActionButton
                                        label="Edit plan"
                                        onClick={() => onEditPlan(plan)}
                                    />
                                </div>
                            </div>
                        ))}
                </div>
            )}
        </EditorSection>
    );
};

export default EditorPricingPage;
