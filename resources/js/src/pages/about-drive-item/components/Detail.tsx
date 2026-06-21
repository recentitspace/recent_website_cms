import { useQuery } from "@tanstack/react-query";
import React from "react";

import { aboutDriveItemApi } from "../../../services/aboutDriveItem";

interface DetailProps {
    itemId: number | null;
}

const Detail: React.FC<DetailProps> = ({ itemId }) => {
    const { data: item, isLoading } = useQuery({
        queryKey: ["about-drive-item", itemId],
        queryFn: () => (itemId ? aboutDriveItemApi.getById(itemId) : null),
        enabled: !!itemId,
    });

    if (isLoading) {
        return null;
    }

    if (!item) {
        return (
            <div className="flex h-full items-center justify-center">
                <p className="text-gray-500">No about drive item selected</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 text-sm">
            {item.image?.url && (
                <img
                    src={item.image.url}
                    alt={item.title}
                    className="max-h-32 w-full rounded object-cover"
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
            {item.bullets && item.bullets.length > 0 && (
                <div>
                    <span className="font-medium text-gray-500">Bullet points</span>
                    <ul className="mt-1 list-inside list-disc space-y-1">
                        {item.bullets.map((bullet, index) => (
                            <li key={index}>{bullet}</li>
                        ))}
                    </ul>
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
