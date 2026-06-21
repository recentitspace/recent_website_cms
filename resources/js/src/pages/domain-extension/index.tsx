import { IconTrash } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import moment from "moment";
import { useState } from "react";
import { toast } from "sonner";

import Breadcrumb from "../../components/Breadcrumb";
import DataTableWithSidebar from "../../components/DataTableWithSidebar";
import { useConfirmDialog, useSidebarDetail } from "../../hooks";
import { domainExtensionApi } from "../../services/domainExtension";
import { ColumnConfig } from "../../types/columns";
import { IDomainExtension } from "../../types";
import DomainExtensionDetail from "./components/DomainExtensionDetail";
import DomainExtensionModal from "./components/DomainExtensionModal";

const DomainExtensionList = () => {
    const queryClient = useQueryClient();
    const [selectedRecords, setSelectedRecords] = useState<IDomainExtension[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [extensionToEdit, setExtensionToEdit] = useState<IDomainExtension | null>(null);

    const {
        selectedId: selectedExtensionId,
        showSidebar,
        openSidebar,
        closeSidebar,
    } = useSidebarDetail();

    const { confirmDelete } = useConfirmDialog();

    const { mutate: deleteExtension } = useMutation({
        mutationFn: (id: number) => domainExtensionApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["Domain Extension Table"] });
            toast.success("Domain extension deleted");
            if (selectedExtensionId) {
                closeSidebar();
            }
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to delete domain extension");
        },
    });

    const { mutate: bulkDeleteExtension } = useMutation({
        mutationFn: (ids: number[]) => domainExtensionApi.bulkDelete(ids),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["Domain Extension Table"] });
            toast.success(`${data.deleted_count} domain extensions deleted`);
            if (selectedExtensionId) {
                closeSidebar();
            }
            setSelectedRecords([]);
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to delete domain extensions");
        },
    });

    const breadcrumbItems = [
        { title: "Dashboard", path: "/dashboard" },
        { title: "Domain Extensions" },
    ];

    const handleDelete = async (id: number) => {
        const confirmed = await confirmDelete();
        if (confirmed) {
            deleteExtension(id);
        }
    };

    const handleBulkDelete = async () => {
        if (selectedRecords.length === 0) {
            toast.error("Please select items to delete");
            return;
        }

        const confirmed = await confirmDelete({
            title: "Delete Multiple Domain Extensions",
            text: `Are you sure you want to delete ${selectedRecords.length} selected items?`,
        });

        if (confirmed) {
            bulkDeleteExtension(selectedRecords.map((record) => record.id));
        }
    };

    const columns: ColumnConfig<IDomainExtension>[] = [
        {
            accessor: "id",
            title: "ID",
            type: "number",
            sortable: true,
            width: 70,
        },
        {
            accessor: "extension",
            title: "Extension",
            type: "text",
            sortable: true,
            render: ({ extension, badge }) => (
                <div>
                    <span className="font-medium">{extension}</span>
                    {badge && (
                        <span className="ml-2 text-xs text-primary">({badge})</span>
                    )}
                </div>
            ),
        },
        {
            accessor: "price",
            title: "Price",
            type: "text",
            sortable: true,
            render: ({ price, period }) => (
                <span>
                    ${price}/{period || "yr"}
                </span>
            ),
        },
        {
            accessor: "sort_order",
            title: "Order",
            type: "number",
            sortable: true,
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
                        setExtensionToEdit(record);
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

            <DataTableWithSidebar<IDomainExtension>
                title="Domain Extension Table"
                columns={columns}
                fetchData={(params) => domainExtensionApi.getAll(params)}
                searchFields={["extension", "price", "badge"]}
                sortCol="sort_order"
                query={{}}
                rowSelectionEnabled={true}
                onSelectionChange={setSelectedRecords}
                searchable={true}
                exportable={{
                    enabled: true,
                    name: "Domain Extensions",
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
                            setExtensionToEdit(null);
                            setIsOpen(true);
                        }}
                    >
                        <Plus size={16} />
                        Add Domain Extension
                    </button>
                }
                showSidebar={showSidebar}
                sidebarTitle="Domain Extension Details"
                onCloseSidebar={closeSidebar}
                sidebarContent={
                    <DomainExtensionDetail extensionId={selectedExtensionId} />
                }
            />

            <DomainExtensionModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                extensionToEdit={extensionToEdit}
            />
        </div>
    );
};

export default DomainExtensionList;
