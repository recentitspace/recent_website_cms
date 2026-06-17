import { IconTrash } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import moment from "moment";
import { useState } from "react";
import { toast } from "sonner";
import Breadcrumb from "../../components/Breadcrumb";
import DataTableWithSidebar from "../../components/DataTableWithSidebar";
import { useConfirmDialog, useSidebarDetail } from "../../hooks";
import { portfolioItemApi } from "../../services/portfolioItem";
import { ColumnConfig } from "../../types/columns";
import { IPortfolioItem } from "../../types";
import PortfolioItemDetail from "./components/PortfolioItemDetail";
import PortfolioItemModal from "./components/PortfolioItemModal";

const PortfolioItemList = () => {
    const queryClient = useQueryClient();
    const [selectedRecords, setSelectedRecords] = useState<IPortfolioItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [itemToEdit, setItemToEdit] = useState<IPortfolioItem | null>(null);

    const {
        selectedId: selectedItemId,
        showSidebar,
        openSidebar,
        closeSidebar,
    } = useSidebarDetail();

    const { confirmDelete } = useConfirmDialog();

    const { mutate: deleteItem } = useMutation({
        mutationFn: (id: number) => portfolioItemApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["Portfolio Item Table"] });
            toast.success("Portfolio item deleted successfully");
            if (selectedItemId) {
                closeSidebar();
            }
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to delete portfolio item");
        },
    });

    const { mutate: bulkDeleteItem } = useMutation({
        mutationFn: (ids: number[]) => portfolioItemApi.bulkDelete(ids),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["Portfolio Item Table"] });
            toast.success(`${data.deleted_count} portfolio items deleted successfully`);
            if (selectedItemId) {
                closeSidebar();
            }
            setSelectedRecords([]);
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to delete portfolio items");
        },
    });

    const breadcrumbItems = [
        { title: "Dashboard", path: "/dashboard" },
        { title: "Portfolio Items" },
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
            title: "Delete Multiple Portfolio Items",
            text: `Are you sure you want to delete ${selectedRecords.length} selected items?`,
        });

        if (confirmed) {
            bulkDeleteItem(selectedRecords.map((record) => record.id));
        }
    };

    const columns: ColumnConfig<IPortfolioItem>[] = [
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
            render: ({ title, thumbnail }) => (
                <div className="flex items-center gap-2">
                    {thumbnail?.url && (
                        <img
                            src={thumbnail.url}
                            alt={title}
                            className="h-8 w-8 rounded object-cover"
                        />
                    )}
                    <span className="font-medium">{title}</span>
                </div>
            ),
        },
        {
            accessor: "category",
            title: "Category",
            type: "text",
            sortable: false,
            render: ({ category }) => category?.name || "-",
        },
        {
            accessor: "type",
            title: "Type",
            type: "text",
            sortable: true,
            render: ({ type }) => <span className="capitalize">{type}</span>,
        },
        {
            accessor: "featured",
            title: "Featured",
            type: "text",
            sortable: true,
            render: ({ featured }) => (
                <span className={featured ? "text-success" : "text-gray-400"}>
                    {featured ? "Yes" : "No"}
                </span>
            ),
        },
        {
            accessor: "is_published",
            title: "Published",
            type: "text",
            sortable: true,
            render: ({ is_published }) => (
                <span className={is_published ? "text-success" : "text-danger"}>
                    {is_published ? "Yes" : "No"}
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

            <DataTableWithSidebar<IPortfolioItem>
                title="Portfolio Item Table"
                columns={columns}
                fetchData={(params) => portfolioItemApi.getAll(params)}
                searchFields={["title", "slug", "tags"]}
                sortCol="sort_order"
                query={{}}
                rowSelectionEnabled={true}
                onSelectionChange={setSelectedRecords}
                searchable={true}
                exportable={{
                    enabled: true,
                    name: "Portfolio Items",
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
                        Add Portfolio Item
                    </button>
                }
                showSidebar={showSidebar}
                sidebarTitle="Portfolio Item Details"
                onCloseSidebar={closeSidebar}
                sidebarContent={<PortfolioItemDetail itemId={selectedItemId} />}
            />

            <PortfolioItemModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                itemToEdit={itemToEdit}
            />
        </div>
    );
};

export default PortfolioItemList;
