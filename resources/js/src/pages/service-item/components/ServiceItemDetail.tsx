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
            {item.detail_hero_title && (
                <div>
                    <span className="font-medium text-gray-500">Detail Hero Title</span>
                    <p>{item.detail_hero_title}</p>
                </div>
            )}
            {item.detail_hero_description && (
                <div>
                    <span className="font-medium text-gray-500">Detail Hero Description</span>
                    <p className="whitespace-pre-wrap">{item.detail_hero_description}</p>
                </div>
            )}
            {item.hero_image?.url && (
                <div>
                    <span className="font-medium text-gray-500">Hero Image</span>
                    <img
                        src={item.hero_image.url}
                        alt={item.detail_hero_title || item.title}
                        className="mt-1 max-h-32 rounded object-cover"
                    />
                </div>
            )}
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
            {item.process_title && (
                <div>
                    <span className="font-medium text-gray-500">Process Title</span>
                    <p>{item.process_title}</p>
                </div>
            )}
            {item.process_subtitle && (
                <div>
                    <span className="font-medium text-gray-500">Process Subtitle</span>
                    <p>{item.process_subtitle}</p>
                </div>
            )}
            {item.process_steps && item.process_steps.length > 0 && (
                <div>
                    <span className="font-medium text-gray-500">Process Steps</span>
                    <ol className="mt-1 list-inside list-decimal space-y-3">
                        {item.process_steps.map((step, index) => (
                            <li key={`${step.title}-${index}`}>
                                <span className="font-medium">{step.title}</span>
                                {step.description && (
                                    <p className="whitespace-pre-wrap text-gray-600 dark:text-gray-300">
                                        {step.description}
                                    </p>
                                )}
                                {step.tasks && step.tasks.length > 0 && (
                                    <ul className="mt-1 list-inside list-disc text-gray-600 dark:text-gray-300">
                                        {step.tasks.map((task) => (
                                            <li key={task}>{task}</li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ol>
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
