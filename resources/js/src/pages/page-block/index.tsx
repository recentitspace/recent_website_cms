import { IconTrash } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import moment from "moment";
import { useState } from "react";
import { toast } from "sonner";
import Breadcrumb from "../../components/Breadcrumb";
import DataTableWithSidebar from "../../components/DataTableWithSidebar";
import FormSelect from "../../components/form/FormSelect";
import { useConfirmDialog, useSidebarDetail } from "../../hooks";
import { pageBlockApi } from "../../services/pageBlock";
import { ColumnConfig } from "../../types/columns";
import { IPageBlock } from "../../types";
import PageBlockDetail from "./components/PageBlockDetail";
import PageBlockModal from "./components/PageBlockModal";

const pageFilterOptions = [
    { value: "", label: "All Pages" },
    { value: "home", label: "Home" },
    { value: "about", label: "About" },
    { value: "faq", label: "FAQ" },
];

const PageBlockList = () => {
    const queryClient = useQueryClient();
    const [selectedRecords, setSelectedRecords] = useState<IPageBlock[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [blockToEdit, setBlockToEdit] = useState<IPageBlock | null>(null);
    const [pageFilter, setPageFilter] = useState<string>("");

    const {
        selectedId: selectedBlockId,
        showSidebar,
        openSidebar,
        closeSidebar,
    } = useSidebarDetail();

    const { confirmDelete } = useConfirmDialog();

    const { mutate: deleteBlock } = useMutation({
        mutationFn: (id: number) => pageBlockApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["Page Block Table"] });
            queryClient.invalidateQueries({ queryKey: ["Page Blocks Select"] });
            toast.success("Page block deleted successfully");
            if (selectedBlockId) {
                closeSidebar();
            }
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to delete page block");
        },
    });

    const { mutate: bulkDeleteBlock } = useMutation({
        mutationFn: (ids: number[]) => pageBlockApi.bulkDelete(ids),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["Page Block Table"] });
            queryClient.invalidateQueries({ queryKey: ["Page Blocks Select"] });
            toast.success(`${data.deleted_count} page blocks deleted successfully`);
            if (selectedBlockId) {
                closeSidebar();
            }
            setSelectedRecords([]);
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to delete page blocks");
        },
    });

    const breadcrumbItems = [
        { title: "Dashboard", path: "/dashboard" },
        { title: "Page Blocks" },
    ];

    const handleDelete = async (id: number) => {
        const confirmed = await confirmDelete();
        if (confirmed) {
            deleteBlock(id);
        }
    };

    const handleBulkDelete = async () => {
        if (selectedRecords.length === 0) {
            toast.error("Please select items to delete");
            return;
        }

        const confirmed = await confirmDelete({
            title: "Delete Multiple Page Blocks",
            text: `Are you sure you want to delete ${selectedRecords.length} selected items?`,
        });

        if (confirmed) {
            bulkDeleteBlock(selectedRecords.map((record) => record.id));
        }
    };

    const columns: ColumnConfig<IPageBlock>[] = [
        {
            accessor: "id",
            title: "ID",
            type: "number",
            sortable: true,
            width: 70,
        },
        {
            accessor: "page",
            title: "Page",
            type: "text",
            sortable: true,
            render: ({ page }) => (
                <span className="capitalize font-medium">{page}</span>
            ),
        },
        {
            accessor: "key",
            title: "Key",
            type: "text",
            sortable: true,
        },
        {
            accessor: "title",
            title: "Title",
            type: "text",
            sortable: true,
            render: ({ title, image }) => (
                <div className="flex items-center gap-2">
                    {image?.url && (
                        <img src={image.url} alt={title || ""} className="h-8 w-8 object-cover rounded" />
                    )}
                    <span className="font-medium">{title || "-"}</span>
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
                        setBlockToEdit(record);
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

            <DataTableWithSidebar<IPageBlock>
                title="Page Block Table"
                columns={columns}
                fetchData={(params) =>
                    pageBlockApi.getAll({
                        ...params,
                        ...(pageFilter ? { page_name: pageFilter } : {}),
                    })
                }
                searchFields={["page", "key", "title", "subtitle"]}
                sortCol="sort_order"
                query={{ page_name: pageFilter || undefined }}
                rowSelectionEnabled={true}
                onSelectionChange={setSelectedRecords}
                searchable={true}
                exportable={{
                    enabled: true,
                    name: "Page Blocks",
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
                                value={pageFilter}
                                onChange={setPageFilter}
                                options={pageFilterOptions}
                            />
                        </div>
                        <button
                            type="button"
                            className="btn btn-primary gap-2"
                            onClick={() => {
                                setBlockToEdit(null);
                                setIsOpen(true);
                            }}
                        >
                            <Plus size={16} />
                            Add Page Block
                        </button>
                    </div>
                }
                showSidebar={showSidebar}
                sidebarTitle="Page Block Details"
                onCloseSidebar={closeSidebar}
                sidebarContent={<PageBlockDetail blockId={selectedBlockId} />}
            />

            <PageBlockModal isOpen={isOpen} setIsOpen={setIsOpen} blockToEdit={blockToEdit} />
        </div>
    );
};

export default PageBlockList;
