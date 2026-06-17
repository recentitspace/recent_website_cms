import { IconRefresh, IconTrash } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import CustomDataTable from "../../components/datatable";
import { useConfirmDialog } from "../../hooks";
import { clientApi } from "../../services/client";
import { IClient } from "../../types";
import { ColumnConfig } from "../../types/columns";

const TrashClients = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const [selectedItems, setSelectedItems] = useState<IClient[]>([]);
    const { confirmDelete } = useConfirmDialog();
    const tableKey = t("trashed_clients");

    const restoreMutation = useMutation({
        mutationFn: (id: number) => clientApi.restore(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [tableKey] });
            queryClient.invalidateQueries({ queryKey: ["Client Table"] });
            toast.success("Client restored successfully");
        },
        onError: (error: any) => {
            toast.error(error.message || "Error restoring client");
        },
    });

    const forceDeleteMutation = useMutation({
        mutationFn: (id: number) => clientApi.forceDelete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [tableKey] });
            toast.success("Client permanently deleted");
        },
        onError: (error: any) => {
            toast.error(error.message || "Error deleting client");
        },
    });

    const bulkRestoreMutation = useMutation({
        mutationFn: (ids: number[]) => clientApi.bulkRestore(ids),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [tableKey] });
            queryClient.invalidateQueries({ queryKey: ["Client Table"] });
            toast.success(`${data.restored_count} clients restored successfully`);
            setSelectedItems([]);
        },
        onError: (error: any) => {
            toast.error(error.message || "Error restoring clients");
        },
    });

    const bulkForceDeleteMutation = useMutation({
        mutationFn: (ids: number[]) => clientApi.bulkForceDelete(ids),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [tableKey] });
            toast.success(`${data.deleted_count} clients permanently deleted`);
            setSelectedItems([]);
        },
        onError: (error: any) => {
            toast.error(error.message || "Error permanently deleting clients");
        },
    });

    const columns: ColumnConfig<IClient>[] = [
        { accessor: "id", title: "ID", type: "number", sortable: true, width: 80 },
        {
            accessor: "name",
            title: "Name",
            type: "text",
            sortable: true,
            render: ({ name }) => <div className="font-medium">{name}</div>,
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
        <CustomDataTable<IClient>
            title={tableKey}
            columns={columns}
            fetchData={(params) => clientApi.getTrashed(params)}
            searchFields={["name", "url"]}
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
                            title: "Delete Multiple Clients",
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

export default TrashClients;
