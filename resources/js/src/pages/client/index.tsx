import { IconTrash } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import moment from "moment";
import { useState } from "react";
import { toast } from "sonner";
import Breadcrumb from "../../components/Breadcrumb";
import DataTableWithSidebar from "../../components/DataTableWithSidebar";
import { useConfirmDialog, useSidebarDetail } from "../../hooks";
import { clientApi } from "../../services/client";
import { ColumnConfig } from "../../types/columns";
import { IClient } from "../../types";
import ClientDetail from "./components/ClientDetail";
import ClientModal from "./components/ClientModal";

const ClientList = () => {
    const queryClient = useQueryClient();
    const [selectedRecords, setSelectedRecords] = useState<IClient[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [clientToEdit, setClientToEdit] = useState<IClient | null>(null);

    const {
        selectedId: selectedClientId,
        showSidebar,
        openSidebar,
        closeSidebar,
    } = useSidebarDetail();

    const { confirmDelete } = useConfirmDialog();

    const { mutate: deleteClient } = useMutation({
        mutationFn: (id: number) => clientApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["Client Table"] });
            toast.success("Client deleted successfully");
            if (selectedClientId) {
                closeSidebar();
            }
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to delete client");
        },
    });

    const { mutate: bulkDeleteClient } = useMutation({
        mutationFn: (ids: number[]) => clientApi.bulkDelete(ids),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["Client Table"] });
            toast.success(`${data.deleted_count} clients deleted successfully`);
            if (selectedClientId) {
                closeSidebar();
            }
            setSelectedRecords([]);
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to delete clients");
        },
    });

    const breadcrumbItems = [
        { title: "Dashboard", path: "/dashboard" },
        { title: "Clients" },
    ];

    const handleDelete = async (id: number) => {
        const confirmed = await confirmDelete();
        if (confirmed) {
            deleteClient(id);
        }
    };

    const handleBulkDelete = async () => {
        if (selectedRecords.length === 0) {
            toast.error("Please select items to delete");
            return;
        }

        const confirmed = await confirmDelete({
            title: "Delete Multiple Clients",
            text: `Are you sure you want to delete ${selectedRecords.length} selected items?`,
        });

        if (confirmed) {
            bulkDeleteClient(selectedRecords.map((record) => record.id));
        }
    };

    const columns: ColumnConfig<IClient>[] = [
        {
            accessor: "id",
            title: "ID",
            type: "number",
            sortable: true,
            width: 70,
        },
        {
            accessor: "name",
            title: "Name",
            type: "text",
            sortable: true,
            render: ({ name, logo }) => (
                <div className="flex items-center gap-2">
                    {logo?.url && (
                        <img src={logo.url} alt={name} className="h-8 w-8 object-contain" />
                    )}
                    <span className="font-medium">{name}</span>
                </div>
            ),
        },
        {
            accessor: "sort_order",
            title: "Order",
            type: "number",
            sortable: true,
        },
        {
            accessor: "show_on_home",
            title: "Home",
            type: "text",
            sortable: true,
            render: ({ show_on_home }) => (show_on_home ? "Yes" : "No"),
        },
        {
            accessor: "is_active",
            title: "Active",
            type: "text",
            sortable: true,
            render: ({ is_active }) => (
                <span className={is_active ? "text-success" : "text-danger"}>
                    {is_active ? "Yes" : "No"}
                </span>
            ),
        },
        {
            accessor: "created_at",
            title: "Created",
            type: "date",
            sortable: true,
            render: ({ created_at }) => (
                <div>{created_at ? moment(created_at).format("MM/DD/YYYY") : "-"}</div>
            ),
        },
        {
            accessor: "actions",
            title: "Actions",
            type: "actions",
            sortable: false,
            textAlignment: "center",
            actions: [
                {
                    type: "view",
                    onClick: (record) => openSidebar(record.id),
                },
                {
                    type: "edit",
                    onClick: (record) => {
                        setClientToEdit(record);
                        setIsOpen(true);
                    },
                },
                {
                    type: "delete",
                    onClick: (record) => handleDelete(record.id),
                },
            ],
        },
    ];

    return (
        <div>
            <Breadcrumb items={breadcrumbItems} />

            <DataTableWithSidebar<IClient>
                title="Client Table"
                columns={columns}
                fetchData={(params) => clientApi.getAll(params)}
                searchFields={["name", "url"]}
                sortCol="sort_order"
                query={{}}
                rowSelectionEnabled={true}
                onSelectionChange={setSelectedRecords}
                searchable={true}
                exportable={{
                    enabled: true,
                    name: "Clients",
                    formats: ["csv", "excel", "pdf"],
                }}
                className="mt-5"
                bulkActions={[
                    {
                        label: "Delete Selected",
                        icon: <IconTrash size={18} />,
                        color: "red",
                        onClick: () => handleBulkDelete(),
                    },
                ]}
                buttons={
                    <button
                        type="button"
                        className="btn btn-primary gap-2"
                        onClick={() => {
                            setClientToEdit(null);
                            setIsOpen(true);
                        }}
                    >
                        <Plus size={16} />
                        Add Client
                    </button>
                }
                showSidebar={showSidebar}
                sidebarTitle="Client Details"
                onCloseSidebar={closeSidebar}
                sidebarContent={<ClientDetail clientId={selectedClientId} />}
            />

            <ClientModal isOpen={isOpen} setIsOpen={setIsOpen} clientToEdit={clientToEdit} />
        </div>
    );
};

export default ClientList;
