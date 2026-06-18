import { useQuery } from "@tanstack/react-query";
import React from "react";
import { serviceItemApi } from "../../../services/serviceItem";

interface ServiceItemDetailProps {
    itemId: number | null;
}

const ServiceItemDetail: React.FC<ServiceItemDetailProps> = ({ itemId }) => {
    const { data: item, isLoading } = useQuery({
        queryKey: ["service-item", itemId],
        queryFn: () => (itemId ? serviceItemApi.getById(itemId) : null),
        enabled: !!itemId,
    });

    if (isLoading) {
        return null;
    }

    if (!item) {
        return (
            <div className="flex h-full items-center justify-center">
                <p className="text-gray-500">No service item selected</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 text-sm">
            <div>
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{item.slug}</p>
            </div>
            {item.category && (
                <div>
                    <span className="font-medium text-gray-500">Category</span>
                    <p>{item.category.title}</p>
                </div>
            )}
            {item.icon?.url && (
                <div>
                    <span className="font-medium text-gray-500">Icon</span>
                    <img
                        src={item.icon.url}
                        alt={item.title}
                        className="mt-1 h-12 w-12 object-contain"
                    />
                </div>
            )}
            <div>
                <span className="font-medium text-gray-500">Page Path</span>
                <p>{item.page_path}</p>
            </div>
            {item.highlights && item.highlights.length > 0 && (
                <div>
                    <span className="font-medium text-gray-500">Highlights</span>
                    <ul className="mt-1 list-inside list-disc">
                        {item.highlights.map((highlight) => (
                            <li key={highlight}>{highlight}</li>
                        ))}
                    </ul>
                </div>
            )}
            <div>
                <span className="font-medium text-gray-500">Sort Order</span>
                <p>{item.sort_order}</p>
            </div>
            <div>
                <span className="font-medium text-gray-500">Status</span>
                <p>{item.is_active ? "Active" : "Inactive"}</p>
            </div>
            <div>
                <span className="font-medium text-gray-500">Show on Home</span>
                <p>{item.show_on_home ? "Yes" : "No"}</p>
            </div>
        </div>
    );
};

export default ServiceItemDetail;
