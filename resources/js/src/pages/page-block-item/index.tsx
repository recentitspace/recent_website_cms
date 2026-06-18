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
import { pageBlockApi } from "../../services/pageBlock";
import { pageBlockItemApi } from "../../services/pageBlockItem";
import { ColumnConfig } from "../../types/columns";
import { IPageBlockItem } from "../../types";
import PageBlockItemDetail from "./components/PageBlockItemDetail";
import PageBlockItemModal from "./components/PageBlockItemModal";

const PageBlockItemList = () => {
    const queryClient = useQueryClient();
    const [selectedRecords, setSelectedRecords] = useState<IPageBlockItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [itemToEdit, setItemToEdit] = useState<IPageBlockItem | null>(null);
    const [blockFilter, setBlockFilter] = useState<string>("");

    const {
        selectedId: selectedItemId,
        showSidebar,
        openSidebar,
        closeSidebar,
    } = useSidebarDetail();

    const { confirmDelete } = useConfirmDialog();

    const { data: blocksResponse } = useQuery({
        queryKey: ["Page Blocks Select"],
        queryFn: () =>
            pageBlockApi.getAll({
                per_page: 100,
                sort_by: "sort_order",
                sort_direction: "asc",
            }),
    });

    const blockFilterOptions = [
        { value: "", label: "All Blocks" },
        ...(blocksResponse?.data?.map((block) => ({
            value: String(block.id),
            label: `${block.page} / ${block.key}${block.title ? ` — ${block.title}` : ""}`,
        })) || []),
    ];

    const { mutate: deleteItem } = useMutation({
        mutationFn: (id: number) => pageBlockItemApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["Page Block Item Table"] });
            toast.success("Page block item deleted successfully");
            if (selectedItemId) {
                closeSidebar();
            }
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to delete page block item");
        },
    });

    const { mutate: bulkDeleteItem } = useMutation({
        mutationFn: (ids: number[]) => pageBlockItemApi.bulkDelete(ids),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["Page Block Item Table"] });
            toast.success(`${data.deleted_count} page block items deleted successfully`);
            if (selectedItemId) {
                closeSidebar();
            }
            setSelectedRecords([]);
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to delete page block items");
        },
    });

    const breadcrumbItems = [
        { title: "Dashboard", path: "/dashboard" },
        { title: "Page Block Items" },
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
            title: "Delete Multiple Page Block Items",
            text: `Are you sure you want to delete ${selectedRecords.length} selected items?`,
        });

        if (confirmed) {
            bulkDeleteItem(selectedRecords.map((record) => record.id));
        }
    };

    const columns: ColumnConfig<IPageBlockItem>[] = [
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
            accessor: "block",
            title: "Block",
            type: "text",
            sortable: false,
            render: ({ block }) =>
                block ? `${block.page} / ${block.key}` : "-",
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

            <DataTableWithSidebar<IPageBlockItem>
                title="Page Block Item Table"
                columns={columns}
                fetchData={(params) =>
                    pageBlockItemApi.getAll({
                        ...params,
                        ...(blockFilter ? { page_block_id: Number(blockFilter) } : {}),
                    })
                }
                searchFields={["title", "body"]}
                sortCol="sort_order"
                query={{ page_block_id: blockFilter || undefined }}
                rowSelectionEnabled={true}
                onSelectionChange={setSelectedRecords}
                searchable={true}
                exportable={{
                    enabled: true,
                    name: "Page Block Items",
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
                        <div className="w-64">
                            <FormSelect
                                label=""
                                value={blockFilter}
                                onChange={setBlockFilter}
                                options={blockFilterOptions}
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
                sidebarTitle="Page Block Item Details"
                onCloseSidebar={closeSidebar}
                sidebarContent={<PageBlockItemDetail itemId={selectedItemId} />}
            />

            <PageBlockItemModal isOpen={isOpen} setIsOpen={setIsOpen} itemToEdit={itemToEdit} />
        </div>
    );
};

export default PageBlockItemList;
