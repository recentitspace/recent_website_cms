import { IconTrash } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import moment from "moment";
import { useState } from "react";
import { toast } from "sonner";

import Breadcrumb from "../../components/Breadcrumb";
import DataTableWithSidebar from "../../components/DataTableWithSidebar";
import { useConfirmDialog, useSidebarDetail } from "../../hooks";
import { aboutObjectiveApi } from "../../services/aboutObjective";
import { ColumnConfig } from "../../types/columns";
import { IAboutObjective } from "../../types";
import Detail from "./components/Detail";
import Modal from "./components/Modal";

const AboutObjectiveList = () => {
    const queryClient = useQueryClient();
    const [selectedRecords, setSelectedRecords] = useState<IAboutObjective[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [objectiveToEdit, setObjectiveToEdit] = useState<IAboutObjective | null>(null);

    const {
        selectedId: selectedObjectiveId,
        showSidebar,
        openSidebar,
        closeSidebar,
    } = useSidebarDetail();

    const { confirmDelete } = useConfirmDialog();

    const { mutate: deleteObjective } = useMutation({
        mutationFn: (id: number) => aboutObjectiveApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["About Objective Table"] });
            toast.success("About objective deleted");
            if (selectedObjectiveId) {
                closeSidebar();
            }
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to delete about objective");
        },
    });

    const { mutate: bulkDeleteObjective } = useMutation({
        mutationFn: (ids: number[]) => aboutObjectiveApi.bulkDelete(ids),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["About Objective Table"] });
            toast.success(`${data.deleted_count} about objectives deleted`);
            if (selectedObjectiveId) {
                closeSidebar();
            }
            setSelectedRecords([]);
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to delete about objectives");
        },
    });

    const breadcrumbItems = [
        { title: "Dashboard", path: "/dashboard" },
        { title: "About Objectives" },
    ];

    const handleDelete = async (id: number) => {
        const confirmed = await confirmDelete();
        if (confirmed) {
            deleteObjective(id);
        }
    };

    const handleBulkDelete = async () => {
        if (selectedRecords.length === 0) {
            toast.error("Please select items to delete");
            return;
        }

        const confirmed = await confirmDelete({
            title: "Delete Multiple About Objectives",
            text: `Are you sure you want to delete ${selectedRecords.length} selected items?`,
        });

        if (confirmed) {
            bulkDeleteObjective(selectedRecords.map((record) => record.id));
        }
    };

    const columns: ColumnConfig<IAboutObjective>[] = [
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
            render: ({ title }) => <span className="font-medium">{title}</span>,
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
                        setObjectiveToEdit(record);
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

            <DataTableWithSidebar<IAboutObjective>
                title="About Objective Table"
                columns={columns}
                fetchData={(params) => aboutObjectiveApi.getAll(params)}
                searchFields={["title", "body"]}
                sortCol="sort_order"
                query={{}}
                rowSelectionEnabled={true}
                onSelectionChange={setSelectedRecords}
                searchable={true}
                exportable={{
                    enabled: true,
                    name: "About Objectives",
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
                            setObjectiveToEdit(null);
                            setIsOpen(true);
                        }}
                    >
                        <Plus size={16} />
                        Add About Objective
                    </button>
                }
                showSidebar={showSidebar}
                sidebarTitle="About Objective Details"
                onCloseSidebar={closeSidebar}
                sidebarContent={<Detail objectiveId={selectedObjectiveId} />}
            />

            <Modal isOpen={isOpen} setIsOpen={setIsOpen} objectiveToEdit={objectiveToEdit} />
        </div>
    );
};

export default AboutObjectiveList;
