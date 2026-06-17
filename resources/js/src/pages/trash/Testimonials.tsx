import { IconRefresh, IconTrash } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import CustomDataTable from "../../components/datatable";
import { useConfirmDialog } from "../../hooks";
import { testimonialApi } from "../../services/testimonial";
import { ITestimonial } from "../../types";
import { ColumnConfig } from "../../types/columns";

const TrashTestimonials = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const [selectedItems, setSelectedItems] = useState<ITestimonial[]>([]);
    const { confirmDelete } = useConfirmDialog();
    const tableKey = t("trashed_testimonials");

    const restoreMutation = useMutation({
        mutationFn: (id: number) => testimonialApi.restore(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [tableKey] });
            queryClient.invalidateQueries({ queryKey: ["Testimonial Table"] });
            toast.success("Testimonial restored successfully");
        },
        onError: (error: any) => {
            toast.error(error.message || "Error restoring testimonial");
        },
    });

    const forceDeleteMutation = useMutation({
        mutationFn: (id: number) => testimonialApi.forceDelete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [tableKey] });
            toast.success("Testimonial permanently deleted");
        },
        onError: (error: any) => {
            toast.error(error.message || "Error deleting testimonial");
        },
    });

    const bulkRestoreMutation = useMutation({
        mutationFn: (ids: number[]) => testimonialApi.bulkRestore(ids),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [tableKey] });
            queryClient.invalidateQueries({ queryKey: ["Testimonial Table"] });
            toast.success(`${data.restored_count} testimonials restored successfully`);
            setSelectedItems([]);
        },
        onError: (error: any) => {
            toast.error(error.message || "Error restoring testimonials");
        },
    });

    const bulkForceDeleteMutation = useMutation({
        mutationFn: (ids: number[]) => testimonialApi.bulkForceDelete(ids),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [tableKey] });
            toast.success(`${data.deleted_count} testimonials permanently deleted`);
            setSelectedItems([]);
        },
        onError: (error: any) => {
            toast.error(error.message || "Error permanently deleting testimonials");
        },
    });

    const columns: ColumnConfig<ITestimonial>[] = [
        { accessor: "id", title: "ID", type: "number", sortable: true, width: 80 },
        {
            accessor: "author_name",
            title: "Author",
            type: "text",
            sortable: true,
            render: ({ author_name }) => <div className="font-medium">{author_name}</div>,
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
        <CustomDataTable<ITestimonial>
            title={tableKey}
            columns={columns}
            fetchData={(params) => testimonialApi.getTrashed(params)}
            searchFields={["quote", "author_name", "author_role"]}
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
                            title: "Delete Multiple Testimonials",
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

export default TrashTestimonials;
