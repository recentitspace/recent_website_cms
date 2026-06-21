import { useQuery } from "@tanstack/react-query";
import React from "react";

import { whyChooseItemApi } from "../../../services/whyChooseItem";

interface DetailProps {
    itemId: number | null;
}

const Detail: React.FC<DetailProps> = ({ itemId }) => {
    const { data: item, isLoading } = useQuery({
        queryKey: ["why-choose-item", itemId],
        queryFn: () => (itemId ? whyChooseItemApi.getById(itemId) : null),
        enabled: !!itemId,
    });

    if (isLoading) {
        return null;
    }

    if (!item) {
        return (
            <div className="flex h-full items-center justify-center">
                <p className="text-gray-500">No why choose item selected</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 text-sm">
            {item.icon?.url && (
                <img
                    src={item.icon.url}
                    alt={item.title}
                    className="max-h-24 rounded object-contain"
                />
            )}
            <div>
                <h3 className="text-xl font-bold">{item.title}</h3>
            </div>
            {item.body && (
                <div>
                    <span className="font-medium text-gray-500">Description</span>
                    <p className="whitespace-pre-wrap">{item.body}</p>
                </div>
            )}
            <div>
                <span className="font-medium text-gray-500">Display order</span>
                <p>{item.sort_order}</p>
            </div>
            <div>
                <span className="font-medium text-gray-500">Active</span>
                <p>{item.is_active ? "Yes" : "No"}</p>
            </div>
        </div>
    );
};

export default Detail;
