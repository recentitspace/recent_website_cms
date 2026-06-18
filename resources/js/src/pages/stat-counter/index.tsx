import { IconTrash } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import moment from "moment";
import { useState } from "react";
import { toast } from "sonner";
import Breadcrumb from "../../components/Breadcrumb";
import DataTableWithSidebar from "../../components/DataTableWithSidebar";
import { useConfirmDialog, useSidebarDetail } from "../../hooks";
import { statCounterApi } from "../../services/statCounter";
import { ColumnConfig } from "../../types/columns";
import { IStatCounter } from "../../types";
import StatCounterDetail from "./components/StatCounterDetail";
import StatCounterModal from "./components/StatCounterModal";

const StatCounterList = () => {
    const queryClient = useQueryClient();
    const [selectedRecords, setSelectedRecords] = useState<IStatCounter[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [counterToEdit, setCounterToEdit] = useState<IStatCounter | null>(null);

    const {
        selectedId: selectedCounterId,
        showSidebar,
        openSidebar,
        closeSidebar,
    } = useSidebarDetail();

    const { confirmDelete } = useConfirmDialog();

    const { mutate: deleteCounter } = useMutation({
        mutationFn: (id: number) => statCounterApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["Stat Counter Table"] });
            toast.success("Stat counter deleted successfully");
            if (selectedCounterId) {
                closeSidebar();
            }
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to delete stat counter");
        },
    });

    const { mutate: bulkDeleteCounter } = useMutation({
        mutationFn: (ids: number[]) => statCounterApi.bulkDelete(ids),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["Stat Counter Table"] });
            toast.success(`${data.deleted_count} stat counters deleted successfully`);
            if (selectedCounterId) {
                closeSidebar();
            }
            setSelectedRecords([]);
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to delete stat counters");
        },
    });

    const breadcrumbItems = [
        { title: "Dashboard", path: "/dashboard" },
        { title: "Stat Counters" },
    ];

    const handleDelete = async (id: number) => {
        const confirmed = await confirmDelete();
        if (confirmed) {
            deleteCounter(id);
        }
    };

    const handleBulkDelete = async () => {
        if (selectedRecords.length === 0) {
            toast.error("Please select items to delete");
            return;
        }

        const confirmed = await confirmDelete({
            title: "Delete Multiple Stat Counters",
            text: `Are you sure you want to delete ${selectedRecords.length} selected items?`,
        });

        if (confirmed) {
            bulkDeleteCounter(selectedRecords.map((record) => record.id));
        }
    };

    const columns: ColumnConfig<IStatCounter>[] = [
        {
            accessor: "id",
            title: "ID",
            type: "number",
            sortable: true,
            width: 70,
        },
        {
            accessor: "label",
            title: "Label",
            type: "text",
            sortable: true,
            render: ({ label, icon }) => (
                <div className="flex items-center gap-2">
                    {icon?.url && (
                        <img src={icon.url} alt={label} className="h-8 w-8 object-contain" />
                    )}
                    <span className="font-medium">{label}</span>
                </div>
            ),
        },
        {
            accessor: "value",
            title: "Value",
            type: "text",
            sortable: true,
            render: ({ value, suffix }) => (
                <span>
                    {value}
                    {suffix ? suffix : ""}
                </span>
            ),
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
                        setCounterToEdit(record);
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

            <DataTableWithSidebar<IStatCounter>
                title="Stat Counter Table"
                columns={columns}
                fetchData={(params) => statCounterApi.getAll(params)}
                searchFields={["label", "value"]}
                sortCol="sort_order"
                query={{}}
                rowSelectionEnabled={true}
                onSelectionChange={setSelectedRecords}
                searchable={true}
                exportable={{
                    enabled: true,
                    name: "Stat Counters",
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
                            setCounterToEdit(null);
                            setIsOpen(true);
                        }}
                    >
                        <Plus size={16} />
                        Add Stat Counter
                    </button>
                }
                showSidebar={showSidebar}
                sidebarTitle="Stat Counter Details"
                onCloseSidebar={closeSidebar}
                sidebarContent={<StatCounterDetail counterId={selectedCounterId} />}
            />

            <StatCounterModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                counterToEdit={counterToEdit}
            />
        </div>
    );
};

export default StatCounterList;
