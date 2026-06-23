import { IconRefresh, IconTrash } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import CustomDataTable from "../../components/datatable";
import { useConfirmDialog } from "../../hooks";
import { blogApi } from "../../services/blog";
import { IBlog } from "../../types";
import { ColumnConfig } from "../../types/columns";

const TrashBlogs = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const [selectedItems, setSelectedItems] = useState<IBlog[]>([]);
    const { confirmDelete } = useConfirmDialog();
    const tableKey = t("trashed_blogs");

    const restoreMutation = useMutation({
        mutationFn: (id: number) => blogApi.restore(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [tableKey] });
            queryClient.invalidateQueries({ queryKey: ["Blog Table"] });
            toast.success("Blog post restored successfully");
        },
        onError: (error: any) => {
            toast.error(error.message || "Error restoring blog post");
        },
    });

    const forceDeleteMutation = useMutation({
        mutationFn: (id: number) => blogApi.forceDelete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [tableKey] });
            toast.success("Blog post permanently deleted");
        },
        onError: (error: any) => {
            toast.error(error.message || "Error deleting blog post");
        },
    });

    const bulkRestoreMutation = useMutation({
        mutationFn: (ids: number[]) => blogApi.bulkRestore(ids),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [tableKey] });
            queryClient.invalidateQueries({ queryKey: ["Blog Table"] });
            toast.success(`${data.restored_count} blog posts restored successfully`);
            setSelectedItems([]);
        },
        onError: (error: any) => {
            toast.error(error.message || "Error restoring blog posts");
        },
    });

    const bulkForceDeleteMutation = useMutation({
        mutationFn: (ids: number[]) => blogApi.bulkForceDelete(ids),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [tableKey] });
            toast.success(`${data.deleted_count} blog posts permanently deleted`);
            setSelectedItems([]);
        },
        onError: (error: any) => {
            toast.error(error.message || "Error permanently deleting blog posts");
        },
    });

    const columns: ColumnConfig<IBlog>[] = [
        {
            accessor: "title",
            title: "Title",
            type: "text",
            sortable: true,
        },
        {
            accessor: "deleted_at",
            title: "Deleted",
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
                {
                    type: "restore",
                    onClick: (record) => restoreMutation.mutate(record.id),
                },
                {
                    type: "delete",
                    onClick: async (record) => {
                        const confirmed = await confirmDelete({
                            title: "Permanently Delete Blog Post",
                            text: "This action cannot be undone.",
                        });
                        if (confirmed) {
                            forceDeleteMutation.mutate(record.id);
                        }
                    },
                },
            ],
        },
    ];

    return (
        <CustomDataTable<IBlog>
            title={tableKey}
            columns={columns}
            fetchData={(params) => blogApi.getTrashed(params)}
            searchFields={["title", "slug"]}
            sortCol="deleted_at"
            rowSelectionEnabled={true}
            onSelectionChange={setSelectedItems}
            bulkActions={[
                {
                    label: "Restore Selected",
                    icon: <IconRefresh size={18} />,
                    color: "green",
                    onClick: () => bulkRestoreMutation.mutate(selectedItems.map((item) => item.id)),
                },
                {
                    label: "Delete Permanently",
                    icon: <IconTrash size={18} />,
                    color: "red",
                    onClick: async () => {
                        const confirmed = await confirmDelete({
                            title: "Delete Multiple Blog Posts",
                            text: `Permanently delete ${selectedItems.length} selected items?`,
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

export default TrashBlogs;
