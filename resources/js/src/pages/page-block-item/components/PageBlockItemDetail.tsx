import { useQuery } from "@tanstack/react-query";
import React from "react";
import { pageBlockItemApi } from "../../../services/pageBlockItem";

interface PageBlockItemDetailProps {
    itemId: number | null;
}

const PageBlockItemDetail: React.FC<PageBlockItemDetailProps> = ({ itemId }) => {
    const { data: item, isLoading } = useQuery({
        queryKey: ["page-block-item", itemId],
        queryFn: () => (itemId ? pageBlockItemApi.getById(itemId) : null),
        enabled: !!itemId,
    });

    if (isLoading) {
        return null;
    }

    if (!item) {
        return (
            <div className="flex h-full items-center justify-center">
                <p className="text-gray-500">No page block item selected</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 text-sm">
            {item.block && (
                <div>
                    <span className="font-medium text-gray-500">Block</span>
                    <p className="capitalize">
                        {item.block.page} / {item.block.key}
                    </p>
                </div>
            )}
            <div>
                <h3 className="text-xl font-bold">{item.title}</h3>
            </div>
            {item.body && (
                <div>
                    <span className="font-medium text-gray-500">Body</span>
                    <p className="whitespace-pre-wrap">{item.body}</p>
                </div>
            )}
            {item.image?.url && (
                <div>
                    <span className="font-medium text-gray-500">Image</span>
                    <img
                        src={item.image.url}
                        alt={item.title}
                        className="mt-1 max-h-32 rounded object-cover"
                    />
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
            {item.bullets && item.bullets.length > 0 && (
                <div>
                    <span className="font-medium text-gray-500">Bullets</span>
                    <ul className="mt-1 list-inside list-disc">
                        {item.bullets.map((bullet, index) => (
                            <li key={index}>{bullet}</li>
                        ))}
                    </ul>
                </div>
            )}
            <div>
                <span className="font-medium text-gray-500">Sort Order</span>
                <p>{item.sort_order}</p>
            </div>
            <div>
                <span className="font-medium text-gray-500">Active</span>
                <p>{item.is_active ? "Yes" : "No"}</p>
            </div>
        </div>
    );
};

export default PageBlockItemDetail;
