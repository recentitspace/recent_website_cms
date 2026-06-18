import { IconRefresh, IconTrash } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import CustomDataTable from "../../components/datatable";
import { useConfirmDialog } from "../../hooks";
import { pricingSectionApi } from "../../services/pricingSection";
import { IPricingSection } from "../../types";
import { ColumnConfig } from "../../types/columns";

const TrashPricingSections = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const [selectedItems, setSelectedItems] = useState<IPricingSection[]>([]);
    const { confirmDelete } = useConfirmDialog();
    const tableKey = t("trashed_pricing_sections");

    const restoreMutation = useMutation({
        mutationFn: (id: number) => pricingSectionApi.restore(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [tableKey] });
            queryClient.invalidateQueries({ queryKey: ["Pricing Section Table"] });
            toast.success("Pricing section restored successfully");
        },
        onError: (error: any) => {
            toast.error(error.message || "Error restoring pricing section");
        },
    });

    const forceDeleteMutation = useMutation({
        mutationFn: (id: number) => pricingSectionApi.forceDelete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [tableKey] });
            toast.success("Pricing section permanently deleted");
        },
        onError: (error: any) => {
            toast.error(error.message || "Error deleting pricing section");
        },
    });

    const bulkRestoreMutation = useMutation({
        mutationFn: (ids: number[]) => pricingSectionApi.bulkRestore(ids),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [tableKey] });
            queryClient.invalidateQueries({ queryKey: ["Pricing Section Table"] });
            toast.success(`${data.restored_count} pricing sections restored successfully`);
            setSelectedItems([]);
        },
        onError: (error: any) => {
            toast.error(error.message || "Error restoring pricing sections");
        },
    });

    const bulkForceDeleteMutation = useMutation({
        mutationFn: (ids: number[]) => pricingSectionApi.bulkForceDelete(ids),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [tableKey] });
            toast.success(`${data.deleted_count} pricing sections permanently deleted`);
            setSelectedItems([]);
        },
        onError: (error: any) => {
            toast.error(error.message || "Error permanently deleting pricing sections");
        },
    });

    const columns: ColumnConfig<IPricingSection>[] = [
        { accessor: "id", title: "ID", type: "number", sortable: true, width: 80 },
        {
            accessor: "title",
            title: "Title",
            type: "text",
            sortable: true,
            render: ({ title }) => <div className="font-medium">{title}</div>,
        },
        { accessor: "slug", title: "Slug", type: "text", sortable: true },
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
        <CustomDataTable<IPricingSection>
            title={tableKey}
            columns={columns}
            fetchData={(params) => pricingSectionApi.getTrashed(params)}
            searchFields={["title", "slug"]}
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
                            title: "Delete Multiple Pricing Sections",
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

export default TrashPricingSections;
