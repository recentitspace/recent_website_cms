import { useQuery } from "@tanstack/react-query";
import React from "react";
import { clientApi } from "../../../services/client";

interface ClientDetailProps {
    clientId: number | null;
}

const ClientDetail: React.FC<ClientDetailProps> = ({ clientId }) => {
    const { data: client, isLoading } = useQuery({
        queryKey: ["client", clientId],
        queryFn: () => (clientId ? clientApi.getById(clientId) : null),
        enabled: !!clientId,
    });

    if (isLoading) {
        return null;
    }

    if (!client) {
        return (
            <div className="flex h-full items-center justify-center">
                <p className="text-gray-500">No client selected</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 text-sm">
            {client.logo?.url && (
                <img
                    src={client.logo.url}
                    alt={client.name}
                    className="max-h-24 rounded object-contain"
                />
            )}
            <div>
                <h3 className="text-xl font-bold">{client.name}</h3>
            </div>
            {client.url && (
                <div>
                    <span className="font-medium text-gray-500">URL</span>
                    <a
                        href={client.url}
                        target="_blank"
                        rel="noreferrer"
                        className="block break-all text-primary hover:underline"
                    >
                        {client.url}
                    </a>
                </div>
            )}
            <div>
                <span className="font-medium text-gray-500">Sort Order</span>
                <p>{client.sort_order}</p>
            </div>
            <div>
                <span className="font-medium text-gray-500">Active</span>
                <p>{client.is_active ? "Yes" : "No"}</p>
            </div>
            <div>
                <span className="font-medium text-gray-500">Show on Home</span>
                <p>{client.show_on_home ? "Yes" : "No"}</p>
            </div>
        </div>
    );
};

export default ClientDetail;
