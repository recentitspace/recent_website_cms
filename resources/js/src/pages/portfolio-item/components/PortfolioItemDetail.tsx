import { useQuery } from "@tanstack/react-query";
import React from "react";
import { portfolioItemApi } from "../../../services/portfolioItem";

interface PortfolioItemDetailProps {
    itemId: number | null;
}

const PortfolioItemDetail: React.FC<PortfolioItemDetailProps> = ({ itemId }) => {
    const { data: item, isLoading } = useQuery({
        queryKey: ["portfolio-item", itemId],
        queryFn: () => (itemId ? portfolioItemApi.getById(itemId) : null),
        enabled: !!itemId,
    });

    if (isLoading) {
        return null;
    }

    if (!item) {
        return (
            <div className="flex h-full items-center justify-center">
                <p className="text-gray-500">No portfolio item selected</p>
            </div>
        );
    }

    const gallery = item.gallery_images || [];

    return (
        <div className="space-y-4 text-sm">
            {item.thumbnail?.url && (
                <img
                    src={item.thumbnail.url}
                    alt={item.title}
                    className="max-h-40 rounded object-cover"
                />
            )}
            <div>
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{item.slug}</p>
            </div>
            <div>
                <span className="font-medium text-gray-500">Category</span>
                <p>{item.category?.name || "-"}</p>
            </div>
            <div>
                <span className="font-medium text-gray-500">Type</span>
                <p className="capitalize">{item.type}</p>
            </div>
            {item.tags && (
                <div>
                    <span className="font-medium text-gray-500">Tags</span>
                    <p>{item.tags}</p>
                </div>
            )}
            {item.external_link && (
                <div>
                    <span className="font-medium text-gray-500">External Link</span>
                    <a
                        href={item.external_link}
                        target="_blank"
                        rel="noreferrer"
                        className="block break-all text-primary hover:underline"
                    >
                        {item.external_link}
                    </a>
                </div>
            )}
            {item.youtube_url && (
                <div>
                    <span className="font-medium text-gray-500">YouTube URL</span>
                    <p className="break-all">{item.youtube_url}</p>
                </div>
            )}
            <div>
                <span className="font-medium text-gray-500">Featured</span>
                <p>{item.featured ? "Yes" : "No"}</p>
            </div>
            <div>
                <span className="font-medium text-gray-500">Published</span>
                <p>{item.is_published ? "Yes" : "No"}</p>
            </div>
            <div>
                <span className="font-medium text-gray-500">Show on Home</span>
                <p>{item.show_on_home ? "Yes" : "No"}</p>
            </div>
            {item.show_on_home && (
                <div>
                    <span className="font-medium text-gray-500">Home Sort Order</span>
                    <p>{item.home_sort_order ?? "-"}</p>
                </div>
            )}
            {gallery.length > 0 && (
                <div>
                    <span className="font-medium text-gray-500">Gallery</span>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {gallery.map((image) =>
                            image.media?.url ? (
                                <img
                                    key={image.id}
                                    src={image.media.url}
                                    alt={item.title}
                                    className="h-16 w-16 rounded object-cover"
                                />
                            ) : null
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PortfolioItemDetail;
