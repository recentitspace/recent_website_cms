import { IconTrash } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import moment from "moment";
import { useState } from "react";
import { toast } from "sonner";
import Breadcrumb from "../../components/Breadcrumb";
import DataTableWithSidebar from "../../components/DataTableWithSidebar";
import { useConfirmDialog, useSidebarDetail } from "../../hooks";
import { pricingSectionApi } from "../../services/pricingSection";
import { ColumnConfig } from "../../types/columns";
import { IPricingSection } from "../../types";
import PricingSectionDetail from "./components/PricingSectionDetail";
import PricingSectionModal from "./components/PricingSectionModal";

const PricingSectionList = () => {
    const queryClient = useQueryClient();
    const [selectedRecords, setSelectedRecords] = useState<IPricingSection[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [sectionToEdit, setSectionToEdit] = useState<IPricingSection | null>(null);

    const {
        selectedId: selectedSectionId,
        showSidebar,
        openSidebar,
        closeSidebar,
    } = useSidebarDetail();

    const { confirmDelete } = useConfirmDialog();

    const { mutate: deleteSection } = useMutation({
        mutationFn: (id: number) => pricingSectionApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["Pricing Section Table"] });
            toast.success("Pricing section deleted successfully");
            if (selectedSectionId) {
                closeSidebar();
            }
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to delete pricing section");
        },
    });

    const { mutate: bulkDeleteSection } = useMutation({
        mutationFn: (ids: number[]) => pricingSectionApi.bulkDelete(ids),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["Pricing Section Table"] });
            toast.success(`${data.deleted_count} pricing sections deleted successfully`);
            if (selectedSectionId) {
                closeSidebar();
            }
            setSelectedRecords([]);
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to delete pricing sections");
        },
    });

    const breadcrumbItems = [
        { title: "Dashboard", path: "/dashboard" },
        { title: "Pricing Sections" },
    ];

    const handleDelete = async (id: number) => {
        const confirmed = await confirmDelete();
        if (confirmed) {
            deleteSection(id);
        }
    };

    const handleBulkDelete = async () => {
        if (selectedRecords.length === 0) {
            toast.error("Please select items to delete");
            return;
        }

        const confirmed = await confirmDelete({
            title: "Delete Multiple Pricing Sections",
            text: `Are you sure you want to delete ${selectedRecords.length} selected items?`,
        });

        if (confirmed) {
            bulkDeleteSection(selectedRecords.map((record) => record.id));
        }
    };

    const columns: ColumnConfig<IPricingSection>[] = [
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
            render: ({ title }) => <div className="font-medium">{title}</div>,
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
            accessor: "show_on_home",
            title: "Show on Home",
            type: "text",
            sortable: true,
            render: ({ show_on_home }) => (
                <span className={show_on_home ? "text-success" : "text-gray-400"}>
                    {show_on_home ? "Yes" : "No"}
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
                        setSectionToEdit(record);
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

            <DataTableWithSidebar<IPricingSection>
                title="Pricing Section Table"
                columns={columns}
                fetchData={(params) => pricingSectionApi.getAll(params)}
                searchFields={["title", "slug", "subtitle"]}
                sortCol="sort_order"
                query={{}}
                rowSelectionEnabled={true}
                onSelectionChange={setSelectedRecords}
                searchable={true}
                exportable={{
                    enabled: true,
                    name: "Pricing Sections",
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
                            setSectionToEdit(null);
                            setIsOpen(true);
                        }}
                    >
                        <Plus size={16} />
                        Add Section
                    </button>
                }
                showSidebar={showSidebar}
                sidebarTitle="Pricing Section Details"
                onCloseSidebar={closeSidebar}
                sidebarContent={
                    <PricingSectionDetail sectionId={selectedSectionId} />
                }
            />

            <PricingSectionModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                sectionToEdit={sectionToEdit}
            />
        </div>
    );
};

export default PricingSectionList;
