import { IconRefresh, IconTrash } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import CustomDataTable from "../../components/datatable";
import { useConfirmDialog } from "../../hooks";
import { aboutDriveItemApi } from "../../services/aboutDriveItem";
import { IAboutDriveItem } from "../../types";
import { ColumnConfig } from "../../types/columns";

const TrashAboutDriveItems = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const [selectedItems, setSelectedItems] = useState<IAboutDriveItem[]>([]);
    const { confirmDelete } = useConfirmDialog();
    const tableKey = t("trashed_about_drive_items");

    const restoreMutation = useMutation({
        mutationFn: (id: number) => aboutDriveItemApi.restore(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [tableKey] });
            queryClient.invalidateQueries({ queryKey: ["About Drive Item Table"] });
            toast.success("About drive item restored");
        },
        onError: (error: any) => {
            toast.error(error.message || "Error restoring about drive item");
        },
    });

    const forceDeleteMutation = useMutation({
        mutationFn: (id: number) => aboutDriveItemApi.forceDelete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [tableKey] });
            toast.success("About drive item permanently deleted");
        },
        onError: (error: any) => {
            toast.error(error.message || "Error deleting about drive item");
        },
    });

    const bulkRestoreMutation = useMutation({
        mutationFn: (ids: number[]) => aboutDriveItemApi.bulkRestore(ids),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [tableKey] });
            queryClient.invalidateQueries({ queryKey: ["About Drive Item Table"] });
            toast.success(`${data.restored_count} about drive items restored`);
            setSelectedItems([]);
        },
        onError: (error: any) => {
            toast.error(error.message || "Error restoring about drive items");
        },
    });

    const bulkForceDeleteMutation = useMutation({
        mutationFn: (ids: number[]) => aboutDriveItemApi.bulkForceDelete(ids),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [tableKey] });
            toast.success(`${data.deleted_count} about drive items permanently deleted`);
            setSelectedItems([]);
        },
        onError: (error: any) => {
            toast.error(error.message || "Error permanently deleting about drive items");
        },
    });

    const columns: ColumnConfig<IAboutDriveItem>[] = [
        { accessor: "id", title: "ID", type: "number", sortable: true, width: 80 },
        {
            accessor: "title",
            title: "Title",
            type: "text",
            sortable: true,
            render: ({ title }) => <div className="font-medium">{title}</div>,
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
        <CustomDataTable<IAboutDriveItem>
            title={tableKey}
            columns={columns}
            fetchData={(params) => aboutDriveItemApi.getTrashed(params)}
            searchFields={["title", "body"]}
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
                            title: "Delete Multiple About Drive Items",
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

export default TrashAboutDriveItems;
