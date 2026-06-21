import { useQuery } from "@tanstack/react-query";
import React from "react";

import { domainExtensionApi } from "../../../services/domainExtension";

interface DomainExtensionDetailProps {
    extensionId: number | null;
}

const DomainExtensionDetail: React.FC<DomainExtensionDetailProps> = ({ extensionId }) => {
    const { data: extension, isLoading } = useQuery({
        queryKey: ["domain-extension", extensionId],
        queryFn: () => (extensionId ? domainExtensionApi.getById(extensionId) : null),
        enabled: !!extensionId,
    });

    if (isLoading) {
        return null;
    }

    if (!extension) {
        return (
            <div className="flex h-full items-center justify-center">
                <p className="text-gray-500">No domain extension selected</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 text-sm">
            <div>
                <h3 className="text-xl font-bold">{extension.extension}</h3>
                {extension.badge && (
                    <p className="mt-1 text-primary">{extension.badge}</p>
                )}
            </div>
            <div>
                <span className="font-medium text-gray-500">Price</span>
                <p>
                    ${extension.price}/{extension.period || "yr"}
                </p>
            </div>
            <div>
                <span className="font-medium text-gray-500">Display order</span>
                <p>{extension.sort_order}</p>
            </div>
            <div>
                <span className="font-medium text-gray-500">Active</span>
                <p>{extension.is_active ? "Yes" : "No"}</p>
            </div>
        </div>
    );
};

export default DomainExtensionDetail;
