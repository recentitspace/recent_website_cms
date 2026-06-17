import { useQuery } from "@tanstack/react-query";
import React from "react";
import { portfolioCategoryApi } from "../../../services/portfolioCategory";

interface PortfolioCategoryDetailProps {
    categoryId: number | null;
}

const PortfolioCategoryDetail: React.FC<PortfolioCategoryDetailProps> = ({ categoryId }) => {
    const { data: category, isLoading } = useQuery({
        queryKey: ["portfolio-category", categoryId],
        queryFn: () => (categoryId ? portfolioCategoryApi.getById(categoryId) : null),
        enabled: !!categoryId,
    });

    if (isLoading) {
        return null;
    }

    if (!category) {
        return (
            <div className="flex h-full items-center justify-center">
                <p className="text-gray-500">No category selected</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 text-sm">
            <div>
                <h3 className="text-xl font-bold">{category.name}</h3>
                <p className="text-gray-600 dark:text-gray-300">{category.slug}</p>
            </div>
            <div>
                <span className="font-medium text-gray-500">Sort Order</span>
                <p>{category.sort_order}</p>
            </div>
            <div>
                <span className="font-medium text-gray-500">Status</span>
                <p>{category.is_active ? "Active" : "Inactive"}</p>
            </div>
        </div>
    );
};

export default PortfolioCategoryDetail;
