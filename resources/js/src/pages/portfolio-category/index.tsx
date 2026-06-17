import { IconTrash } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import moment from "moment";
import { useState } from "react";
import { toast } from "sonner";
import Breadcrumb from "../../components/Breadcrumb";
import DataTableWithSidebar from "../../components/DataTableWithSidebar";
import { useConfirmDialog, useSidebarDetail } from "../../hooks";
import { portfolioCategoryApi } from "../../services/portfolioCategory";
import { ColumnConfig } from "../../types/columns";
import { IPortfolioCategory } from "../../types";
import PortfolioCategoryDetail from "./components/PortfolioCategoryDetail";
import PortfolioCategoryModal from "./components/PortfolioCategoryModal";

const PortfolioCategoryList = () => {
    const queryClient = useQueryClient();
    const [selectedRecords, setSelectedRecords] = useState<IPortfolioCategory[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [categoryToEdit, setCategoryToEdit] = useState<IPortfolioCategory | null>(null);

    const {
        selectedId: selectedCategoryId,
        showSidebar,
        openSidebar,
        closeSidebar,
    } = useSidebarDetail();

    const { confirmDelete } = useConfirmDialog();

    const { mutate: deleteCategory } = useMutation({
        mutationFn: (id: number) => portfolioCategoryApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["Portfolio Category Table"] });
            toast.success("Category deleted successfully");
            if (selectedCategoryId) {
                closeSidebar();
            }
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to delete category");
        },
    });

    const { mutate: bulkDeleteCategory } = useMutation({
        mutationFn: (ids: number[]) => portfolioCategoryApi.bulkDelete(ids),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["Portfolio Category Table"] });
            toast.success(`${data.deleted_count} categories deleted successfully`);
            if (selectedCategoryId) {
                closeSidebar();
            }
            setSelectedRecords([]);
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to delete categories");
        },
    });

    const breadcrumbItems = [
        { title: "Dashboard", path: "/dashboard" },
        { title: "Portfolio Categories" },
    ];

    const handleDelete = async (id: number) => {
        const confirmed = await confirmDelete();
        if (confirmed) {
            deleteCategory(id);
        }
    };

    const handleBulkDelete = async () => {
        if (selectedRecords.length === 0) {
            toast.error("Please select items to delete");
            return;
        }

        const confirmed = await confirmDelete({
            title: "Delete Multiple Categories",
            text: `Are you sure you want to delete ${selectedRecords.length} selected items?`,
        });

        if (confirmed) {
            bulkDeleteCategory(selectedRecords.map((record) => record.id));
        }
    };

    const columns: ColumnConfig<IPortfolioCategory>[] = [
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
            render: ({ name }) => <div className="font-medium">{name}</div>,
        },
        {
            accessor: "slug",
            title: "Slug",
            type: "text",
            sortable: true,
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
                        setCategoryToEdit(record);
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

            <DataTableWithSidebar<IPortfolioCategory>
                title="Portfolio Category Table"
                columns={columns}
                fetchData={(params) => portfolioCategoryApi.getAll(params)}
                searchFields={["name", "slug"]}
                sortCol="sort_order"
                query={{}}
                rowSelectionEnabled={true}
                onSelectionChange={setSelectedRecords}
                searchable={true}
                exportable={{
                    enabled: true,
                    name: "Portfolio Categories",
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
                            setCategoryToEdit(null);
                            setIsOpen(true);
                        }}
                    >
                        <Plus size={16} />
                        Add Category
                    </button>
                }
                showSidebar={showSidebar}
                sidebarTitle="Category Details"
                onCloseSidebar={closeSidebar}
                sidebarContent={
                    <PortfolioCategoryDetail categoryId={selectedCategoryId} />
                }
            />

            <PortfolioCategoryModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                categoryToEdit={categoryToEdit}
            />
        </div>
    );
};

export default PortfolioCategoryList;
