import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Building2 } from "lucide-react";
import React, { useState } from "react";

import Breadcrumb from "../../components/Breadcrumb";
import ClientModal from "../client/components/ClientModal";
import { clientApi } from "../../services/client";
import { IClient, IQueryParams } from "../../types";
import EditorEntityListSection from "./components/EditorEntityListSection";
import EditorPageShell from "./components/EditorPageShell";
import EditorTip from "./components/EditorTip";

const EditorClientsPage = () => {
    const queryClient = useQueryClient();
    const [clientModalOpen, setClientModalOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState<IClient | null>(null);

    const { data: clientsResponse, isLoading } = useQuery({
        queryKey: ["editor-clients-page-logos"],
        queryFn: () =>
            clientApi.getAll({
                per_page: 100,
                all: "true",
                sort_by: "sort_order",
                sort_direction: "asc",
                filter: { show_on_home: 0 },
            } as IQueryParams & { all?: string }),
    });

    const refresh = () => {
        queryClient.invalidateQueries({ queryKey: ["editor-clients-page-logos"] });
    };

    return (
        <>
            <Breadcrumb
                items={[
                    { title: "Dashboard", path: "/dashboard" },
                    { title: "Website Editor", path: "/editor" },
                    { title: "Clients page" },
                ]}
            />

            <EditorPageShell
                title="Clients page"
                subtitle="Manage the company logos shown on your Our Trusted Clients page."
                icon={Building2}
            >
                <EditorTip>
                    These logos appear on the <strong>/clients</strong> page grid. Homepage
                    scrolling logos are edited separately under <strong>Home page</strong>.
                </EditorTip>

                <EditorEntityListSection
                    title="Trusted client logos"
                    description="Each logo appears as a card on the Clients page."
                    items={clientsResponse?.data || []}
                    isLoading={isLoading}
                    emptyMessage="No client logos on the Clients page yet."
                    emptyHint="Upload company logos (NMDC, banks, partners, etc.). They are not the same as the homepage scrolling strip."
                    onAdd={() => {
                        setSelectedClient(null);
                        setClientModalOpen(true);
                    }}
                    onEdit={(client) => {
                        setSelectedClient(client);
                        setClientModalOpen(true);
                    }}
                    addLabel="Add client logo"
                    editLabel="Edit logo"
                    renderItem={(client) => (
                        <div className="flex items-center gap-3">
                            {client.logo?.url ? (
                                <img
                                    src={client.logo.url}
                                    alt={client.name}
                                    className="h-12 w-12 rounded-lg border border-white-dark/20 bg-white object-contain p-1 dark:border-white/10"
                                />
                            ) : (
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white-dark/10 text-xs text-gray-400">
                                    No logo
                                </div>
                            )}
                            <span className="font-medium text-gray-800 dark:text-gray-100">
                                {client.name}
                            </span>
                        </div>
                    )}
                />
            </EditorPageShell>

            <ClientModal
                isOpen={clientModalOpen}
                setIsOpen={(open) => {
                    setClientModalOpen(open);
                    if (!open) {
                        setSelectedClient(null);
                        refresh();
                    }
                }}
                clientToEdit={selectedClient}
                placement="clients_page"
            />
        </>
    );
};

export default EditorClientsPage;
