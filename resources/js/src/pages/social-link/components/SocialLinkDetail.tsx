import { useQuery } from "@tanstack/react-query";
import React from "react";
import { socialLinkApi } from "../../../services/socialLink";

interface SocialLinkDetailProps {
    socialLinkId: number | null;
}

const SocialLinkDetail: React.FC<SocialLinkDetailProps> = ({ socialLinkId }) => {
    const { data: socialLink, isLoading } = useQuery({
        queryKey: ["social-link", socialLinkId],
        queryFn: () => (socialLinkId ? socialLinkApi.getById(socialLinkId) : null),
        enabled: !!socialLinkId,
    });

    if (isLoading) {
        return null;
    }

    if (!socialLink) {
        return (
            <div className="flex h-full items-center justify-center">
                <p className="text-gray-500">No social link selected</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 text-sm">
            <div>
                <h3 className="text-xl font-bold capitalize">{socialLink.platform}</h3>
                <p className="break-all text-gray-600 dark:text-gray-300">{socialLink.url}</p>
            </div>
            <div>
                <span className="font-medium text-gray-500">Sort Order</span>
                <p>{socialLink.sort_order}</p>
            </div>
            <div>
                <span className="font-medium text-gray-500">Status</span>
                <p>{socialLink.is_active ? "Active" : "Inactive"}</p>
            </div>
            <div>
                <span className="font-medium text-gray-500">Created At</span>
                <p>
                    {socialLink.created_at
                        ? new Date(socialLink.created_at).toLocaleString()
                        : "N/A"}
                </p>
            </div>
        </div>
    );
};

export default SocialLinkDetail;
