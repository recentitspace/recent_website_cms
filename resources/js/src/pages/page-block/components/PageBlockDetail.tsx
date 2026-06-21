import { useQuery } from "@tanstack/react-query";
import React from "react";
import { pageBlockApi } from "../../../services/pageBlock";

interface PageBlockDetailProps {
    blockId: number | null;
}

const PageBlockDetail: React.FC<PageBlockDetailProps> = ({ blockId }) => {
    const { data: block, isLoading } = useQuery({
        queryKey: ["page-block", blockId],
        queryFn: () => (blockId ? pageBlockApi.getById(blockId) : null),
        enabled: !!blockId,
    });

    if (isLoading) {
        return null;
    }

    if (!block) {
        return (
            <div className="flex h-full items-center justify-center">
                <p className="text-gray-500">No page block selected</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 text-sm">
            <div>
                <span className="font-medium text-gray-500">Page</span>
                <p className="capitalize">{block.page}</p>
            </div>
            <div>
                <span className="font-medium text-gray-500">Key</span>
                <p>{block.key}</p>
            </div>
            {block.title && (
                <div>
                    <h3 className="text-xl font-bold">{block.title}</h3>
                </div>
            )}
            {block.subtitle && (
                <div>
                    <span className="font-medium text-gray-500">Subtitle</span>
                    <p>{block.subtitle}</p>
                </div>
            )}
            {block.body && (
                <div>
                    <span className="font-medium text-gray-500">Body</span>
                    <p className="whitespace-pre-wrap">{block.body}</p>
                </div>
            )}
            {block.image?.url && (
                <div>
                    <span className="font-medium text-gray-500">Image</span>
                    <img
                        src={block.image.url}
                        alt={block.title || block.key}
                        className="mt-1 max-h-32 rounded object-cover"
                    />
                </div>
            )}
            {(block.cta_text || block.cta_url) && (
                <div>
                    <span className="font-medium text-gray-500">Primary CTA</span>
                    <p>
                        {block.cta_text}
                        {block.cta_url && (
                            <>
                                {" — "}
                                <a
                                    href={block.cta_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-primary hover:underline"
                                >
                                    {block.cta_url}
                                </a>
                            </>
                        )}
                    </p>
                </div>
            )}
            {(block.cta_secondary_text || block.cta_secondary_url) && (
                <div>
                    <span className="font-medium text-gray-500">Secondary CTA</span>
                    <p>
                        {block.cta_secondary_text}
                        {block.cta_secondary_url && (
                            <>
                                {" — "}
                                <a
                                    href={block.cta_secondary_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-primary hover:underline"
                                >
                                    {block.cta_secondary_url}
                                </a>
                            </>
                        )}
                    </p>
                </div>
            )}
            {block.video_url && (
                <div>
                    <span className="font-medium text-gray-500">Video URL</span>
                    <a
                        href={block.video_url}
                        target="_blank"
                        rel="noreferrer"
                        className="block break-all text-primary hover:underline"
                    >
                        {block.video_url}
                    </a>
                </div>
            )}
            <div>
                <span className="font-medium text-gray-500">Active</span>
                <p>{block.is_active ? "Yes" : "No"}</p>
            </div>
        </div>
    );
};

export default PageBlockDetail;
