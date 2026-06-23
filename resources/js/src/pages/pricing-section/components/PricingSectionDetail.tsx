import { useQuery } from "@tanstack/react-query";
import React from "react";
import { pricingSectionApi } from "../../../services/pricingSection";

interface PricingSectionDetailProps {
    sectionId: number | null;
}

const PricingSectionDetail: React.FC<PricingSectionDetailProps> = ({ sectionId }) => {
    const { data: section, isLoading } = useQuery({
        queryKey: ["pricing-section", sectionId],
        queryFn: () => (sectionId ? pricingSectionApi.getById(sectionId) : null),
        enabled: !!sectionId,
    });

    if (isLoading) {
        return null;
    }

    if (!section) {
        return (
            <div className="flex h-full items-center justify-center">
                <p className="text-gray-500">No pricing section selected</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 text-sm">
            <div>
                <h3 className="text-xl font-bold">{section.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{section.slug}</p>
            </div>
            {section.subtitle && (
                <div>
                    <span className="font-medium text-gray-500">Subtitle</span>
                    <p>{section.subtitle}</p>
                </div>
            )}
            {section.tab_label && (
                <div>
                    <span className="font-medium text-gray-500">Home Tab Label</span>
                    <p>{section.tab_label}</p>
                </div>
            )}
            <div>
                <span className="font-medium text-gray-500">Sort Order</span>
                <p>{section.sort_order}</p>
            </div>
            <div>
                <span className="font-medium text-gray-500">Status</span>
                <p>{section.is_active ? "Active" : "Inactive"}</p>
            </div>
            <div>
                <span className="font-medium text-gray-500">Show on Home</span>
                <p>{section.show_on_home ? "Yes" : "No"}</p>
            </div>
        </div>
    );
};

export default PricingSectionDetail;
