import { IconRefresh, IconTrash } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import CustomDataTable from "../../components/datatable";
import { useConfirmDialog } from "../../hooks";
import { domainExtensionApi } from "../../services/domainExtension";
import { IDomainExtension } from "../../types";
import { ColumnConfig } from "../../types/columns";

const TrashDomainExtensions = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const [selectedItems, setSelectedItems] = useState<IDomainExtension[]>([]);
    const { confirmDelete } = useConfirmDialog();
    const tableKey = t("trashed_domain_extensions");

    const restoreMutation = useMutation({
        mutationFn: (id: number) => domainExtensionApi.restore(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [tableKey] });
            queryClient.invalidateQueries({ queryKey: ["Domain Extension Table"] });
            toast.success("Domain extension restored");
        },
        onError: (error: any) => {
            toast.error(error.message || "Error restoring domain extension");
        },
    });

    const forceDeleteMutation = useMutation({
        mutationFn: (id: number) => domainExtensionApi.forceDelete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [tableKey] });
            toast.success("Domain extension permanently deleted");
        },
        onError: (error: any) => {
            toast.error(error.message || "Error deleting domain extension");
        },
    });

    const bulkRestoreMutation = useMutation({
        mutationFn: (ids: number[]) => domainExtensionApi.bulkRestore(ids),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [tableKey] });
            queryClient.invalidateQueries({ queryKey: ["Domain Extension Table"] });
            toast.success(`${data.restored_count} domain extensions restored`);
            setSelectedItems([]);
        },
        onError: (error: any) => {
            toast.error(error.message || "Error restoring domain extensions");
        },
    });

    const bulkForceDeleteMutation = useMutation({
        mutationFn: (ids: number[]) => domainExtensionApi.bulkForceDelete(ids),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [tableKey] });
            toast.success(`${data.deleted_count} domain extensions permanently deleted`);
            setSelectedItems([]);
        },
        onError: (error: any) => {
            toast.error(error.message || "Error permanently deleting domain extensions");
        },
    });

    const columns: ColumnConfig<IDomainExtension>[] = [
        { accessor: "id", title: "ID", type: "number", sortable: true, width: 80 },
        {
            accessor: "extension",
            title: "Extension",
            type: "text",
            sortable: true,
            render: ({ extension }) => <div className="font-medium">{extension}</div>,
        },
        {
            accessor: "price",
            title: "Price",
            type: "text",
            sortable: true,
            render: ({ price, period }) => (
                <span>
                    ${price}/{period || "yr"}
                </span>
            ),
        },
        {
            accessor: "deleted_at",
            title: "Deleted At",
            type: "date",
            sortable: true,
            render: ({ deleted_at }) => (
                <div>{deleted_at ? moment(deleted_at).format("MM/DD/YYYY") : "-"}</div>
            ),
        },
        {
            accessor: "actions",
            title: "Actions",
            type: "actions",
            sortable: false,
            textAlignment: "center",
            actions: [
                { type: "restore", onClick: (record) => restoreMutation.mutate(record.id) },
                {
                    type: "delete",
                    onClick: async (record) => {
                        const confirmed = await confirmDelete();
                        if (confirmed) {
                            forceDeleteMutation.mutate(record.id);
                        }
                    },
                },
            ],
        },
    ];

    return (
        <CustomDataTable<IDomainExtension>
            title={tableKey}
            columns={columns}
            fetchData={(params) => domainExtensionApi.getTrashed(params)}
            searchFields={["extension", "price", "badge"]}
            rowSelectionEnabled={true}
            onSelectionChange={setSelectedItems}
            bulkActions={[
                {
                    label: "Restore Selected",
                    icon: <IconRefresh size={18} />,
                    color: "primary",
                    onClick: () => {
                        if (selectedItems.length === 0) {
                            toast.error("Please select items to restore");
                            return;
                        }
                        bulkRestoreMutation.mutate(selectedItems.map((item) => item.id));
                    },
                },
                {
                    label: "Delete Permanently",
                    icon: <IconTrash size={18} />,
                    color: "red",
                    onClick: async () => {
                        if (selectedItems.length === 0) {
                            toast.error("Please select items to delete");
                            return;
                        }
                        const confirmed = await confirmDelete({
                            title: "Delete Multiple Domain Extensions",
                            text: `Are you sure you want to permanently delete ${selectedItems.length} selected items?`,
                        });
                        if (confirmed) {
                            bulkForceDeleteMutation.mutate(selectedItems.map((item) => item.id));
                        }
                    },
                },
            ]}
        />
    );
};

export default TrashDomainExtensions;
