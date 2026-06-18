import { IconTrash } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import moment from "moment";
import { useState } from "react";
import { toast } from "sonner";
import Breadcrumb from "../../components/Breadcrumb";
import DataTableWithSidebar from "../../components/DataTableWithSidebar";
import { useConfirmDialog, useSidebarDetail } from "../../hooks";
import { serviceCategoryApi } from "../../services/serviceCategory";
import { ColumnConfig } from "../../types/columns";
import { IServiceCategory } from "../../types";
import ServiceCategoryDetail from "./components/ServiceCategoryDetail";
import ServiceCategoryModal from "./components/ServiceCategoryModal";

const ServiceCategoryList = () => {
    const queryClient = useQueryClient();
    const [selectedRecords, setSelectedRecords] = useState<IServiceCategory[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [categoryToEdit, setCategoryToEdit] = useState<IServiceCategory | null>(null);

    const {
        selectedId: selectedCategoryId,
        showSidebar,
        openSidebar,
        closeSidebar,
    } = useSidebarDetail();

    const { confirmDelete } = useConfirmDialog();

    const { mutate: deleteCategory } = useMutation({
        mutationFn: (id: number) => serviceCategoryApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["Service Category Table"] });
            toast.success("Service category deleted successfully");
            if (selectedCategoryId) {
                closeSidebar();
            }
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to delete service category");
        },
    });

    const { mutate: bulkDeleteCategory } = useMutation({
        mutationFn: (ids: number[]) => serviceCategoryApi.bulkDelete(ids),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["Service Category Table"] });
            toast.success(`${data.deleted_count} service categories deleted successfully`);
            if (selectedCategoryId) {
                closeSidebar();
            }
            setSelectedRecords([]);
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to delete service categories");
        },
    });

    const breadcrumbItems = [
        { title: "Dashboard", path: "/dashboard" },
        { title: "Service Categories" },
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
            title: "Delete Multiple Service Categories",
            text: `Are you sure you want to delete ${selectedRecords.length} selected items?`,
        });

        if (confirmed) {
            bulkDeleteCategory(selectedRecords.map((record) => record.id));
        }
    };

    const columns: ColumnConfig<IServiceCategory>[] = [
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

            <DataTableWithSidebar<IServiceCategory>
                title="Service Category Table"
                columns={columns}
                fetchData={(params) => serviceCategoryApi.getAll(params)}
                searchFields={["title", "slug", "page_path"]}
                sortCol="sort_order"
                query={{}}
                rowSelectionEnabled={true}
                onSelectionChange={setSelectedRecords}
                searchable={true}
                exportable={{
                    enabled: true,
                    name: "Service Categories",
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
                sidebarTitle="Service Category Details"
                onCloseSidebar={closeSidebar}
                sidebarContent={<ServiceCategoryDetail categoryId={selectedCategoryId} />}
            />

            <ServiceCategoryModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                categoryToEdit={categoryToEdit}
            />
        </div>
    );
};

export default ServiceCategoryList;
