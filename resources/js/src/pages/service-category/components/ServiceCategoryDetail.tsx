import { useQuery } from "@tanstack/react-query";
import React from "react";
import { serviceCategoryApi } from "../../../services/serviceCategory";

interface ServiceCategoryDetailProps {
    categoryId: number | null;
}

const ServiceCategoryDetail: React.FC<ServiceCategoryDetailProps> = ({ categoryId }) => {
    const { data: category, isLoading } = useQuery({
        queryKey: ["service-category", categoryId],
        queryFn: () => (categoryId ? serviceCategoryApi.getById(categoryId) : null),
        enabled: !!categoryId,
    });

    if (isLoading) {
        return null;
    }

    if (!category) {
        return (
            <div className="flex h-full items-center justify-center">
                <p className="text-gray-500">No service category selected</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 text-sm">
            <div>
                <h3 className="text-xl font-bold">{category.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{category.slug}</p>
            </div>
            {category.icon?.url && (
                <div>
                    <span className="font-medium text-gray-500">Icon</span>
                    <img
                        src={category.icon.url}
                        alt={category.title}
                        className="mt-1 h-12 w-12 object-contain"
                    />
                </div>
            )}
            {category.hero_image?.url && (
                <div>
                    <span className="font-medium text-gray-500">Hero Image</span>
                    <img
                        src={category.hero_image.url}
                        alt={category.hero_title || category.title}
                        className="mt-1 max-h-32 rounded object-cover"
                    />
                </div>
            )}
            {category.hero_title && (
                <div>
                    <span className="font-medium text-gray-500">Hero Title</span>
                    <p>{category.hero_title}</p>
                </div>
            )}
            {category.description && (
                <div>
                    <span className="font-medium text-gray-500">Description</span>
                    <p className="whitespace-pre-wrap">{category.description}</p>
                </div>
            )}
            {category.listing_subtitle && (
                <div>
                    <span className="font-medium text-gray-500">Listing Subtitle</span>
                    <p>{category.listing_subtitle}</p>
                </div>
            )}
            <div>
                <span className="font-medium text-gray-500">Page Path</span>
                <p>{category.page_path}</p>
            </div>
            <div>
                <span className="font-medium text-gray-500">CTA Text</span>
                <p>{category.cta_text}</p>
            </div>
            {category.process_title && (
                <div>
                    <span className="font-medium text-gray-500">Process Title</span>
                    <p>{category.process_title}</p>
                </div>
            )}
            {category.process_subtitle && (
                <div>
                    <span className="font-medium text-gray-500">Process Subtitle</span>
                    <p>{category.process_subtitle}</p>
                </div>
            )}
            {category.process_steps && category.process_steps.length > 0 && (
                <div>
                    <span className="font-medium text-gray-500">Process Steps</span>
                    <ol className="mt-1 list-inside list-decimal space-y-2">
                        {category.process_steps.map((step, index) => (
                            <li key={`${step.title}-${index}`}>
                                <span className="font-medium">{step.title}</span>
                                {step.description && (
                                    <p className="whitespace-pre-wrap text-gray-600 dark:text-gray-300">
                                        {step.description}
                                    </p>
                                )}
                            </li>
                        ))}
                    </ol>
                </div>
            )}
            <div>
                <span className="font-medium text-gray-500">Sort Order</span>
                <p>{category.sort_order}</p>
            </div>
            <div>
                <span className="font-medium text-gray-500">Status</span>
                <p>{category.is_active ? "Active" : "Inactive"}</p>
            </div>
            <div>
                <span className="font-medium text-gray-500">Show on Home</span>
                <p>{category.show_on_home ? "Yes" : "No"}</p>
            </div>
        </div>
    );
};

export default ServiceCategoryDetail;
