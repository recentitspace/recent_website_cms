import { IconTrash } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import moment from "moment";
import { useState } from "react";
import { toast } from "sonner";
import Breadcrumb from "../../components/Breadcrumb";
import DataTableWithSidebar from "../../components/DataTableWithSidebar";
import FormSelect from "../../components/form/FormSelect";
import { useConfirmDialog, useSidebarDetail } from "../../hooks";
import { serviceCategoryApi } from "../../services/serviceCategory";
import { serviceItemApi } from "../../services/serviceItem";
import { ColumnConfig } from "../../types/columns";
import { IServiceItem } from "../../types";
import ServiceItemDetail from "./components/ServiceItemDetail";
import ServiceItemModal from "./components/ServiceItemModal";

const ServiceItemList = () => {
    const queryClient = useQueryClient();
    const [selectedRecords, setSelectedRecords] = useState<IServiceItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [itemToEdit, setItemToEdit] = useState<IServiceItem | null>(null);
    const [categoryFilter, setCategoryFilter] = useState<string>("");

    const {
        selectedId: selectedItemId,
        showSidebar,
        openSidebar,
        closeSidebar,
    } = useSidebarDetail();

    const { confirmDelete } = useConfirmDialog();

    const { data: categoriesResponse } = useQuery({
        queryKey: ["Service Categories Select"],
        queryFn: () =>
            serviceCategoryApi.getAll({
                per_page: 100,
                sort_by: "sort_order",
                sort_direction: "asc",
            }),
    });

    const categoryFilterOptions = [
        { value: "", label: "All Categories" },
        ...(categoriesResponse?.data?.map((category) => ({
            value: String(category.id),
            label: category.title,
        })) || []),
    ];

    const { mutate: deleteItem } = useMutation({
        mutationFn: (id: number) => serviceItemApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["Service Item Table"] });
            toast.success("Service item deleted successfully");
            if (selectedItemId) {
                closeSidebar();
            }
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to delete service item");
        },
    });

    const { mutate: bulkDeleteItem } = useMutation({
        mutationFn: (ids: number[]) => serviceItemApi.bulkDelete(ids),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["Service Item Table"] });
            toast.success(`${data.deleted_count} service items deleted successfully`);
            if (selectedItemId) {
                closeSidebar();
            }
            setSelectedRecords([]);
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to delete service items");
        },
    });

    const breadcrumbItems = [
        { title: "Dashboard", path: "/dashboard" },
        { title: "Service Items" },
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
            title: "Delete Multiple Service Items",
            text: `Are you sure you want to delete ${selectedRecords.length} selected items?`,
        });

        if (confirmed) {
            bulkDeleteItem(selectedRecords.map((record) => record.id));
        }
    };

    const columns: ColumnConfig<IServiceItem>[] = [
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
            accessor: "category",
            title: "Category",
            type: "text",
            sortable: false,
            render: ({ category }) => category?.title || "-",
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

            <DataTableWithSidebar<IServiceItem>
                title="Service Item Table"
                columns={columns}
                fetchData={(params) =>
                    serviceItemApi.getAll({
                        ...params,
                        ...(categoryFilter
                            ? { service_category_id: Number(categoryFilter) }
                            : {}),
                    })
                }
                searchFields={["title", "slug", "page_path"]}
                sortCol="sort_order"
                query={{ service_category_id: categoryFilter || undefined }}
                rowSelectionEnabled={true}
                onSelectionChange={setSelectedRecords}
                searchable={true}
                exportable={{
                    enabled: true,
                    name: "Service Items",
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
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="w-48">
                            <FormSelect
                                label=""
                                value={categoryFilter}
                                onChange={setCategoryFilter}
                                options={categoryFilterOptions}
                            />
                        </div>
                        <button
                            type="button"
                            className="btn btn-primary gap-2"
                            onClick={() => {
                                setItemToEdit(null);
                                setIsOpen(true);
                            }}
                        >
                            <Plus size={16} />
                            Add Item
                        </button>
                    </div>
                }
                showSidebar={showSidebar}
                sidebarTitle="Service Item Details"
                onCloseSidebar={closeSidebar}
                sidebarContent={<ServiceItemDetail itemId={selectedItemId} />}
            />

            <ServiceItemModal isOpen={isOpen} setIsOpen={setIsOpen} itemToEdit={itemToEdit} />
        </div>
    );
};

export default ServiceItemList;
