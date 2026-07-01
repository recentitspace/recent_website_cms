import moment from "moment";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import Breadcrumb from "../../components/Breadcrumb";
import DataTableWithSidebar from "../../components/DataTableWithSidebar";
import { useConfirmDialog, useSidebarDetail } from "../../hooks";
import { domainRequestApi } from "../../services/domainRequest";
import { ColumnConfig } from "../../types/columns";
import { IDomainRequest } from "../../types";
import DomainRequestDetail from "./components/DomainRequestDetail";

const statusClass: Record<string, string> = {
    pending: "text-warning",
    contacted: "text-primary",
    canceled: "text-danger",
    completed: "text-success",
};

const DomainRequestList = () => {
    const queryClient = useQueryClient();

    const {
        selectedId: selectedRequestId,
        showSidebar,
        openSidebar,
        closeSidebar,
    } = useSidebarDetail();

    const { confirmDelete } = useConfirmDialog();

    const { mutate: deleteRequest } = useMutation({
        mutationFn: (id: number) => domainRequestApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["Domain Request Table"] });
            toast.success("Domain request deleted");
            if (selectedRequestId) {
                closeSidebar();
            }
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to delete domain request");
        },
    });

    const breadcrumbItems = [
        { title: "Dashboard", path: "/dashboard" },
        { title: "Domain Requests" },
    ];

    const handleDelete = async (id: number) => {
        const confirmed = await confirmDelete();
        if (confirmed) {
            deleteRequest(id);
        }
    };

    const columns: ColumnConfig<IDomainRequest>[] = [
        {
            accessor: "id",
            title: "ID",
            type: "number",
            sortable: true,
            width: 70,
        },
        {
            accessor: "domain_name",
            title: "Domain",
            type: "text",
            sortable: true,
            render: (record) => (
                <span className="font-medium">
                    {record.domain_name}
                    <span className="text-primary">{record.extension}</span>
                </span>
            ),
        },
        {
            accessor: "extension_price",
            title: "Price",
            type: "text",
            sortable: true,
            render: ({ extension_price, extension_period }) => (
                <span>
                    ${extension_price}
                    {extension_period || "/yr"}
                </span>
            ),
        },
        {
            accessor: "email",
            title: "Email",
            type: "text",
            sortable: true,
        },
        {
            accessor: "phone",
            title: "Phone",
            type: "text",
            sortable: true,
        },
        {
            accessor: "status",
            title: "Status",
            type: "text",
            sortable: true,
            render: ({ status }) => (
                <span className={`capitalize ${statusClass[status] || ""}`}>{status}</span>
            ),
        },
        {
            accessor: "created_at",
            title: "Requested",
            type: "date",
            sortable: true,
            render: ({ created_at }) => (
                <div>{created_at ? moment(created_at).format("MM/DD/YYYY HH:mm") : "-"}</div>
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
                    type: "delete",
                    onClick: (record) => handleDelete(record.id),
                },
            ],
        },
    ];

    return (
        <div>
            <Breadcrumb items={breadcrumbItems} />

            <DataTableWithSidebar<IDomainRequest>
                title="Domain Request Table"
                columns={columns}
                fetchData={(params) => domainRequestApi.getAll(params)}
                searchFields={["domain_name", "extension", "email", "phone", "address", "status"]}
                sortCol="created_at"
                query={{}}
                rowSelectionEnabled={false}
                searchable={true}
                exportable={{
                    enabled: true,
                    name: "Domain Requests",
                    formats: ["csv", "excel", "pdf"],
                }}
                className="mt-5"
                showSidebar={showSidebar}
                sidebarTitle="Domain Request Details"
                onCloseSidebar={closeSidebar}
                sidebarContent={
                    <DomainRequestDetail requestId={selectedRequestId} />
                }
            />
        </div>
    );
};

export default DomainRequestList;
