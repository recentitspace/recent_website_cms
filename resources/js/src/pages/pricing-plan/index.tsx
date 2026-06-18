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
import { pricingPlanApi } from "../../services/pricingPlan";
import { pricingSectionApi } from "../../services/pricingSection";
import { ColumnConfig } from "../../types/columns";
import { IPricingPlan } from "../../types";
import PricingPlanDetail from "./components/PricingPlanDetail";
import PricingPlanModal from "./components/PricingPlanModal";

const PricingPlanList = () => {
    const queryClient = useQueryClient();
    const [selectedRecords, setSelectedRecords] = useState<IPricingPlan[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [planToEdit, setPlanToEdit] = useState<IPricingPlan | null>(null);
    const [sectionFilter, setSectionFilter] = useState<string>("");

    const {
        selectedId: selectedPlanId,
        showSidebar,
        openSidebar,
        closeSidebar,
    } = useSidebarDetail();

    const { confirmDelete } = useConfirmDialog();

    const { data: sectionsResponse } = useQuery({
        queryKey: ["Pricing Sections Select"],
        queryFn: () =>
            pricingSectionApi.getAll({
                per_page: 100,
                sort_by: "sort_order",
                sort_direction: "asc",
            }),
    });

    const sectionFilterOptions = [
        { value: "", label: "All Sections" },
        ...(sectionsResponse?.data?.map((section) => ({
            value: String(section.id),
            label: section.title,
        })) || []),
    ];

    const { mutate: deletePlan } = useMutation({
        mutationFn: (id: number) => pricingPlanApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["Pricing Plan Table"] });
            toast.success("Pricing plan deleted successfully");
            if (selectedPlanId) {
                closeSidebar();
            }
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to delete pricing plan");
        },
    });

    const { mutate: bulkDeletePlan } = useMutation({
        mutationFn: (ids: number[]) => pricingPlanApi.bulkDelete(ids),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["Pricing Plan Table"] });
            toast.success(`${data.deleted_count} pricing plans deleted successfully`);
            if (selectedPlanId) {
                closeSidebar();
            }
            setSelectedRecords([]);
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to delete pricing plans");
        },
    });

    const breadcrumbItems = [
        { title: "Dashboard", path: "/dashboard" },
        { title: "Pricing Plans" },
    ];

    const handleDelete = async (id: number) => {
        const confirmed = await confirmDelete();
        if (confirmed) {
            deletePlan(id);
        }
    };

    const handleBulkDelete = async () => {
        if (selectedRecords.length === 0) {
            toast.error("Please select items to delete");
            return;
        }

        const confirmed = await confirmDelete({
            title: "Delete Multiple Pricing Plans",
            text: `Are you sure you want to delete ${selectedRecords.length} selected items?`,
        });

        if (confirmed) {
            bulkDeletePlan(selectedRecords.map((record) => record.id));
        }
    };

    const columns: ColumnConfig<IPricingPlan>[] = [
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
            accessor: "section",
            title: "Section",
            type: "text",
            sortable: false,
            render: ({ section }) => section?.title || "-",
        },
        {
            accessor: "price",
            title: "Price",
            type: "text",
            sortable: true,
            render: ({ price, price_period }) => (
                <span>
                    {price}
                    {price_period ? ` / ${price_period}` : ""}
                </span>
            ),
        },
        {
            accessor: "style",
            title: "Style",
            type: "text",
            sortable: true,
            render: ({ style }) => <span className="capitalize">{style}</span>,
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
                        setPlanToEdit(record);
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

            <DataTableWithSidebar<IPricingPlan>
                title="Pricing Plan Table"
                columns={columns}
                fetchData={(params) =>
                    pricingPlanApi.getAll({
                        ...params,
                        ...(sectionFilter
                            ? { pricing_section_id: Number(sectionFilter) }
                            : {}),
                    })
                }
                searchFields={["name", "price"]}
                sortCol="sort_order"
                query={{
                    pricing_section_id: sectionFilter || undefined,
                }}
                rowSelectionEnabled={true}
                onSelectionChange={setSelectedRecords}
                searchable={true}
                exportable={{
                    enabled: true,
                    name: "Pricing Plans",
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
                    <div className="flex flex-wrap items-end gap-3">
                        <div className="w-48">
                            <FormSelect
                                label="Section"
                                options={sectionFilterOptions}
                                value={sectionFilter}
                                onChange={setSectionFilter}
                            />
                        </div>
                        <button
                            type="button"
                            className="btn btn-primary gap-2"
                            onClick={() => {
                                setPlanToEdit(null);
                                setIsOpen(true);
                            }}
                        >
                            <Plus size={16} />
                            Add Plan
                        </button>
                    </div>
                }
                showSidebar={showSidebar}
                sidebarTitle="Pricing Plan Details"
                onCloseSidebar={closeSidebar}
                sidebarContent={<PricingPlanDetail planId={selectedPlanId} />}
            />

            <PricingPlanModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                planToEdit={planToEdit}
            />
        </div>
    );
};

export default PricingPlanList;
