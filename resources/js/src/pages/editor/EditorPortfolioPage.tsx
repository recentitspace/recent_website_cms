import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Briefcase } from "lucide-react";
import React, { useState } from "react";

import Breadcrumb from "../../components/Breadcrumb";
import PortfolioCategoryModal from "../portfolio-category/components/PortfolioCategoryModal";
import PortfolioItemModal from "../portfolio-item/components/PortfolioItemModal";
import { portfolioCategoryApi } from "../../services/portfolioCategory";
import { portfolioItemApi } from "../../services/portfolioItem";
import { IPortfolioCategory, IPortfolioItem } from "../../types";
import EditorActionButton from "./components/EditorActionButton";
import EditorEmptyState from "./components/EditorEmptyState";
import EditorLoadingState from "./components/EditorLoadingState";
import EditorPageShell from "./components/EditorPageShell";
import EditorSection from "./components/EditorSection";

const EditorPortfolioPage = () => {
    const queryClient = useQueryClient();
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);
    const [itemModalOpen, setItemModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<IPortfolioCategory | null>(null);
    const [selectedItem, setSelectedItem] = useState<IPortfolioItem | null>(null);
    const [defaultCategoryId, setDefaultCategoryId] = useState<number | null>(null);

    const openAddCategory = () => {
        setSelectedCategory(null);
        setCategoryModalOpen(true);
    };

    const { data: categoriesResponse, isLoading } = useQuery({
        queryKey: ["editor-portfolio-categories"],
        queryFn: () =>
            portfolioCategoryApi.getAll({
                per_page: 100,
                sort_by: "sort_order",
                sort_direction: "asc",
            }),
    });

    const categories = categoriesResponse?.data || [];

    const refresh = () => {
        queryClient.invalidateQueries({ queryKey: ["editor-portfolio-categories"] });
        categories.forEach((category) => {
            queryClient.invalidateQueries({
                queryKey: ["editor-portfolio-items", category.id],
            });
        });
    };

    return (
        <>
            <Breadcrumb
                items={[
                    { title: "Dashboard", path: "/dashboard" },
                    { title: "Website Editor", path: "/editor" },
                    { title: "Portfolio" },
                ]}
            />

            <EditorPageShell
                title="Portfolio"
                subtitle="Showcase your work with project categories and case studies visitors can browse."
                icon={Briefcase}
                tip={
                    <>
                        Each <strong>category</strong> groups related projects (for example
                        &ldquo;Web Apps&rdquo;). Add <strong>case studies</strong> inside each
                        category with a title, image, and project details.
                    </>
                }
            >
                {isLoading ? (
                    <EditorLoadingState message="Loading portfolio..." />
                ) : categories.length === 0 ? (
                    <EditorEmptyState
                        message="No portfolio categories yet."
                        hint="Create a category first, then add your project case studies."
                        onAction={openAddCategory}
                        actionLabel="Add category"
                    />
                ) : (
                    categories.map((category, index) => (
                        <PortfolioCategoryBlock
                            key={category.id}
                            category={category}
                            sectionNumber={index + 1}
                            onEditCategory={() => {
                                setSelectedCategory(category);
                                setCategoryModalOpen(true);
                            }}
                            onEditItem={(item) => {
                                setSelectedItem(item);
                                setDefaultCategoryId(null);
                                setItemModalOpen(true);
                            }}
                            onAddItem={() => {
                                setSelectedItem(null);
                                setDefaultCategoryId(category.id);
                                setItemModalOpen(true);
                            }}
                        />
                    ))
                )}
            </EditorPageShell>

            <PortfolioCategoryModal
                isOpen={categoryModalOpen}
                setIsOpen={(open) => {
                    setCategoryModalOpen(open);
                    if (!open) {
                        setSelectedCategory(null);
                        refresh();
                    }
                }}
                categoryToEdit={selectedCategory}
            />

            <PortfolioItemModal
                isOpen={itemModalOpen}
                setIsOpen={(open) => {
                    setItemModalOpen(open);
                    if (!open) {
                        setSelectedItem(null);
                        setDefaultCategoryId(null);
                        refresh();
                    }
                }}
                itemToEdit={selectedItem}
                defaultPortfolioCategoryId={defaultCategoryId}
            />
        </>
    );
};

interface PortfolioCategoryBlockProps {
    category: IPortfolioCategory;
    sectionNumber: number;
    onEditCategory: () => void;
    onEditItem: (item: IPortfolioItem) => void;
    onAddItem: () => void;
}

const PortfolioCategoryBlock: React.FC<PortfolioCategoryBlockProps> = ({
    category,
    sectionNumber,
    onEditCategory,
    onEditItem,
    onAddItem,
}) => {
    const { data: itemsResponse, isLoading } = useQuery({
        queryKey: ["editor-portfolio-items", category.id],
        queryFn: () =>
            portfolioItemApi.getAll({
                per_page: 100,
                sort_by: "sort_order",
                sort_direction: "asc",
                filter: { portfolio_category_id: String(category.id) },
            }),
    });

    const items = itemsResponse?.data || [];

    return (
        <EditorSection
            title={category.name}
            description="Case studies and projects in this category."
            sectionNumber={sectionNumber}
            action={
                <div className="flex flex-wrap gap-2">
                    <EditorActionButton label="Add project" onClick={onAddItem} />
                    <EditorActionButton
                        label="Edit category"
                        onClick={onEditCategory}
                        variant="primary"
                    />
                </div>
            }
        >
            {isLoading ? (
                <EditorLoadingState message="Loading projects..." />
            ) : items.length === 0 ? (
                <EditorEmptyState
                    message="No projects in this category yet."
                    hint="Add a case study with a title, thumbnail image, and project details."
                    onAction={onAddItem}
                    actionLabel="Add first project"
                />
            ) : (
                <div className="grid gap-4 md:grid-cols-2">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="flex flex-col justify-between gap-4 overflow-hidden rounded-xl border border-white-dark/20 bg-white shadow-sm dark:border-white/10 dark:bg-black/40"
                        >
                            {item.thumbnail?.url && (
                                <img
                                    src={item.thumbnail.url}
                                    alt={item.title}
                                    className="h-36 w-full object-cover"
                                />
                            )}
                            <div className="flex flex-1 flex-col justify-between gap-3 p-4 pt-0">
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white">
                                        {item.title}
                                    </p>
                                    {item.tags && (
                                        <p className="mt-1 text-sm text-gray-500">{item.tags}</p>
                                    )}
                                </div>
                                <div className="flex justify-end">
                                    <EditorActionButton
                                        label="Edit project"
                                        onClick={() => onEditItem(item)}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </EditorSection>
    );
};

export default EditorPortfolioPage;
