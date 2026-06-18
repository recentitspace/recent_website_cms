import { IconRefresh, IconTrash } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import CustomDataTable from "../../components/datatable";
import { useConfirmDialog } from "../../hooks";
import { pageBlockApi } from "../../services/pageBlock";
import { IPageBlock } from "../../types";
import { ColumnConfig } from "../../types/columns";

const TrashPageBlocks = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const [selectedItems, setSelectedItems] = useState<IPageBlock[]>([]);
    const { confirmDelete } = useConfirmDialog();
    const tableKey = t("trashed_page_blocks");

    const restoreMutation = useMutation({
        mutationFn: (id: number) => pageBlockApi.restore(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [tableKey] });
            queryClient.invalidateQueries({ queryKey: ["Page Block Table"] });
            queryClient.invalidateQueries({ queryKey: ["Page Blocks Select"] });
            toast.success("Page block restored successfully");
        },
        onError: (error: any) => {
            toast.error(error.message || "Error restoring page block");
        },
    });

    const forceDeleteMutation = useMutation({
        mutationFn: (id: number) => pageBlockApi.forceDelete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [tableKey] });
            toast.success("Page block permanently deleted");
        },
        onError: (error: any) => {
            toast.error(error.message || "Error deleting page block");
        },
    });

    const bulkRestoreMutation = useMutation({
        mutationFn: (ids: number[]) => pageBlockApi.bulkRestore(ids),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [tableKey] });
            queryClient.invalidateQueries({ queryKey: ["Page Block Table"] });
            queryClient.invalidateQueries({ queryKey: ["Page Blocks Select"] });
            toast.success(`${data.restored_count} page blocks restored successfully`);
            setSelectedItems([]);
        },
        onError: (error: any) => {
            toast.error(error.message || "Error restoring page blocks");
        },
    });

    const bulkForceDeleteMutation = useMutation({
        mutationFn: (ids: number[]) => pageBlockApi.bulkForceDelete(ids),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [tableKey] });
            toast.success(`${data.deleted_count} page blocks permanently deleted`);
            setSelectedItems([]);
        },
        onError: (error: any) => {
            toast.error(error.message || "Error permanently deleting page blocks");
        },
    });

    const columns: ColumnConfig<IPageBlock>[] = [
        { accessor: "id", title: "ID", type: "number", sortable: true, width: 80 },
        {
            accessor: "page",
            title: "Page",
            type: "text",
            sortable: true,
            render: ({ page }) => <span className="capitalize">{page}</span>,
        },
        { accessor: "key", title: "Key", type: "text", sortable: true },
        {
            accessor: "title",
            title: "Title",
            type: "text",
            sortable: true,
            render: ({ title }) => <div className="font-medium">{title || "-"}</div>,
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
        <CustomDataTable<IPageBlock>
            title={tableKey}
            columns={columns}
            fetchData={(params) => pageBlockApi.getTrashed(params)}
            searchFields={["page", "key", "title"]}
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
                            title: "Delete Multiple Page Blocks",
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

export default TrashPageBlocks;
