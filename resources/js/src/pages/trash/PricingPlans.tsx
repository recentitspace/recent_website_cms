import { IconRefresh, IconTrash } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import CustomDataTable from "../../components/datatable";
import { useConfirmDialog } from "../../hooks";
import { pricingPlanApi } from "../../services/pricingPlan";
import { IPricingPlan } from "../../types";
import { ColumnConfig } from "../../types/columns";

const TrashPricingPlans = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const [selectedItems, setSelectedItems] = useState<IPricingPlan[]>([]);
    const { confirmDelete } = useConfirmDialog();
    const tableKey = t("trashed_pricing_plans");

    const restoreMutation = useMutation({
        mutationFn: (id: number) => pricingPlanApi.restore(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [tableKey] });
            queryClient.invalidateQueries({ queryKey: ["Pricing Plan Table"] });
            toast.success("Pricing plan restored successfully");
        },
        onError: (error: any) => {
            toast.error(error.message || "Error restoring pricing plan");
        },
    });

    const forceDeleteMutation = useMutation({
        mutationFn: (id: number) => pricingPlanApi.forceDelete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [tableKey] });
            toast.success("Pricing plan permanently deleted");
        },
        onError: (error: any) => {
            toast.error(error.message || "Error deleting pricing plan");
        },
    });

    const bulkRestoreMutation = useMutation({
        mutationFn: (ids: number[]) => pricingPlanApi.bulkRestore(ids),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [tableKey] });
            queryClient.invalidateQueries({ queryKey: ["Pricing Plan Table"] });
            toast.success(`${data.restored_count} pricing plans restored successfully`);
            setSelectedItems([]);
        },
        onError: (error: any) => {
            toast.error(error.message || "Error restoring pricing plans");
        },
    });

    const bulkForceDeleteMutation = useMutation({
        mutationFn: (ids: number[]) => pricingPlanApi.bulkForceDelete(ids),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [tableKey] });
            toast.success(`${data.deleted_count} pricing plans permanently deleted`);
            setSelectedItems([]);
        },
        onError: (error: any) => {
            toast.error(error.message || "Error permanently deleting pricing plans");
        },
    });

    const columns: ColumnConfig<IPricingPlan>[] = [
        { accessor: "id", title: "ID", type: "number", sortable: true, width: 80 },
        {
            accessor: "name",
            title: "Name",
            type: "text",
            sortable: true,
            render: ({ name }) => <div className="font-medium">{name}</div>,
        },
        {
            accessor: "price",
            title: "Price",
            type: "text",
            sortable: true,
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
        <CustomDataTable<IPricingPlan>
            title={tableKey}
            columns={columns}
            fetchData={(params) => pricingPlanApi.getTrashed(params)}
            searchFields={["name", "price"]}
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
                            title: "Delete Multiple Pricing Plans",
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

export default TrashPricingPlans;
