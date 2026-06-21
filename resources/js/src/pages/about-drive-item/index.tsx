import { IconTrash } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import moment from "moment";
import { useState } from "react";
import { toast } from "sonner";

import Breadcrumb from "../../components/Breadcrumb";
import DataTableWithSidebar from "../../components/DataTableWithSidebar";
import { useConfirmDialog, useSidebarDetail } from "../../hooks";
import { aboutDriveItemApi } from "../../services/aboutDriveItem";
import { ColumnConfig } from "../../types/columns";
import { IAboutDriveItem } from "../../types";
import Detail from "./components/Detail";
import Modal from "./components/Modal";

const AboutDriveItemList = () => {
    const queryClient = useQueryClient();
    const [selectedRecords, setSelectedRecords] = useState<IAboutDriveItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [itemToEdit, setItemToEdit] = useState<IAboutDriveItem | null>(null);

    const {
        selectedId: selectedItemId,
        showSidebar,
        openSidebar,
        closeSidebar,
    } = useSidebarDetail();

    const { confirmDelete } = useConfirmDialog();

    const { mutate: deleteItem } = useMutation({
        mutationFn: (id: number) => aboutDriveItemApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["About Drive Item Table"] });
            toast.success("About drive item deleted");
            if (selectedItemId) {
                closeSidebar();
            }
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to delete about drive item");
        },
    });

    const { mutate: bulkDeleteItem } = useMutation({
        mutationFn: (ids: number[]) => aboutDriveItemApi.bulkDelete(ids),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["About Drive Item Table"] });
            toast.success(`${data.deleted_count} about drive items deleted`);
            if (selectedItemId) {
                closeSidebar();
            }
            setSelectedRecords([]);
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to delete about drive items");
        },
    });

    const breadcrumbItems = [
        { title: "Dashboard", path: "/dashboard" },
        { title: "About Drive Items" },
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
            title: "Delete Multiple About Drive Items",
            text: `Are you sure you want to delete ${selectedRecords.length} selected items?`,
        });

        if (confirmed) {
            bulkDeleteItem(selectedRecords.map((record) => record.id));
        }
    };

    const columns: ColumnConfig<IAboutDriveItem>[] = [
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
            render: ({ title, image }) => (
                <div className="flex items-center gap-2">
                    {image?.url && (
                        <img src={image.url} alt={title} className="h-8 w-8 rounded object-cover" />
                    )}
                    <span className="font-medium">{title}</span>
                </div>
            ),
        },
        {
            accessor: "bullets",
            title: "Bullets",
            type: "text",
            sortable: false,
            render: ({ bullets }) => (
                <span className="text-gray-600">{bullets?.length || 0}</span>
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

            <DataTableWithSidebar<IAboutDriveItem>
                title="About Drive Item Table"
                columns={columns}
                fetchData={(params) => aboutDriveItemApi.getAll(params)}
                searchFields={["title", "body"]}
                sortCol="sort_order"
                query={{}}
                rowSelectionEnabled={true}
                onSelectionChange={setSelectedRecords}
                searchable={true}
                exportable={{
                    enabled: true,
                    name: "About Drive Items",
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
                        Add About Drive Item
                    </button>
                }
                showSidebar={showSidebar}
                sidebarTitle="About Drive Item Details"
                onCloseSidebar={closeSidebar}
                sidebarContent={<Detail itemId={selectedItemId} />}
            />

            <Modal isOpen={isOpen} setIsOpen={setIsOpen} itemToEdit={itemToEdit} />
        </div>
    );
};

export default AboutDriveItemList;
