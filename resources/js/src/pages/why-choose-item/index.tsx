import { IconTrash } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import moment from "moment";
import { useState } from "react";
import { toast } from "sonner";

import Breadcrumb from "../../components/Breadcrumb";
import DataTableWithSidebar from "../../components/DataTableWithSidebar";
import { useConfirmDialog, useSidebarDetail } from "../../hooks";
import { whyChooseItemApi } from "../../services/whyChooseItem";
import { ColumnConfig } from "../../types/columns";
import { IWhyChooseItem } from "../../types";
import Detail from "./components/Detail";
import Modal from "./components/Modal";

const WhyChooseItemList = () => {
    const queryClient = useQueryClient();
    const [selectedRecords, setSelectedRecords] = useState<IWhyChooseItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [itemToEdit, setItemToEdit] = useState<IWhyChooseItem | null>(null);

    const {
        selectedId: selectedItemId,
        showSidebar,
        openSidebar,
        closeSidebar,
    } = useSidebarDetail();

    const { confirmDelete } = useConfirmDialog();

    const { mutate: deleteItem } = useMutation({
        mutationFn: (id: number) => whyChooseItemApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["Why Choose Item Table"] });
            toast.success("Why choose item deleted");
            if (selectedItemId) {
                closeSidebar();
            }
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to delete why choose item");
        },
    });

    const { mutate: bulkDeleteItem } = useMutation({
        mutationFn: (ids: number[]) => whyChooseItemApi.bulkDelete(ids),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["Why Choose Item Table"] });
            toast.success(`${data.deleted_count} why choose items deleted`);
            if (selectedItemId) {
                closeSidebar();
            }
            setSelectedRecords([]);
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to delete why choose items");
        },
    });

    const breadcrumbItems = [
        { title: "Dashboard", path: "/dashboard" },
        { title: "Why Choose Items" },
    ];

    const handleDelete = async (id: number) => {
        const confirmed = await confirmDelete();
        if (confirmed) {
            deleteItem(id);
        }
    };

    const handleBulkDelete = async () => {
        if (selectedRecords.length === 0) {
            toast.error("Please select items to delete");
            return;
        }

        const confirmed = await confirmDelete({
            title: "Delete Multiple Why Choose Items",
            text: `Are you sure you want to delete ${selectedRecords.length} selected items?`,
        });

        if (confirmed) {
            bulkDeleteItem(selectedRecords.map((record) => record.id));
        }
    };

    const columns: ColumnConfig<IWhyChooseItem>[] = [
        {
            accessor: "id",
            title: "ID",
            type: "number",
            sortable: true,
            width: 70,
        },
        {
            accessor: "title",
            title: "Title",
            type: "text",
            sortable: true,
            render: ({ title, icon }) => (
                <div className="flex items-center gap-2">
                    {icon?.url && (
                        <img src={icon.url} alt={title} className="h-8 w-8 object-contain" />
                    )}
                    <span className="font-medium">{title}</span>
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
                        setItemToEdit(record);
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

            <DataTableWithSidebar<IWhyChooseItem>
                title="Why Choose Item Table"
                columns={columns}
                fetchData={(params) => whyChooseItemApi.getAll(params)}
                searchFields={["title", "body"]}
                sortCol="sort_order"
                query={{}}
                rowSelectionEnabled={true}
                onSelectionChange={setSelectedRecords}
                searchable={true}
                exportable={{
                    enabled: true,
                    name: "Why Choose Items",
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
                            setItemToEdit(null);
                            setIsOpen(true);
                        }}
                    >
                        <Plus size={16} />
                        Add Why Choose Item
                    </button>
                }
                showSidebar={showSidebar}
                sidebarTitle="Why Choose Item Details"
                onCloseSidebar={closeSidebar}
                sidebarContent={<Detail itemId={selectedItemId} />}
            />

            <Modal isOpen={isOpen} setIsOpen={setIsOpen} itemToEdit={itemToEdit} />
        </div>
    );
};

export default WhyChooseItemList;
