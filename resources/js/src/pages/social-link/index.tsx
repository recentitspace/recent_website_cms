import { IconTrash } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import moment from "moment";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import Breadcrumb from "../../components/Breadcrumb";
import DataTableWithSidebar from "../../components/DataTableWithSidebar";
import { useCmsContentMode } from "../../contexts/CmsContentModeContext";
import { useConfirmDialog, useSidebarDetail } from "../../hooks";
import { socialLinkApi } from "../../services/socialLink";
import { ColumnConfig } from "../../types/columns";
import { ISocialLink } from "../../types";
import SocialLinkDetail from "./components/SocialLinkDetail";
import SocialLinkModal from "./components/SocialLinkModal";

const SocialLinkTable = () => {
    const queryClient = useQueryClient();
    const [selectedRecords, setSelectedRecords] = useState<ISocialLink[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [socialLinkToEdit, setSocialLinkToEdit] = useState<ISocialLink | null>(null);

    const {
        selectedId: selectedSocialLinkId,
        showSidebar,
        openSidebar,
        closeSidebar,
    } = useSidebarDetail();

    const { confirmDelete } = useConfirmDialog();

    const { mutate: deleteSocialLink } = useMutation({
        mutationFn: (id: number) => socialLinkApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["Social Link Table"] });
            toast.success("Social link deleted successfully");
            if (selectedSocialLinkId) {
                closeSidebar();
            }
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to delete social link");
        },
    });

    const { mutate: bulkDeleteSocialLink } = useMutation({
        mutationFn: (ids: number[]) => socialLinkApi.bulkDelete(ids),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["Social Link Table"] });
            toast.success(`${data.deleted_count} social links deleted successfully`);
            if (selectedSocialLinkId) {
                closeSidebar();
            }
            setSelectedRecords([]);
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to delete social links");
        },
    });

    const breadcrumbItems = [
        { title: "Dashboard", path: "/dashboard" },
        { title: "Social Links" },
    ];

    const handleDelete = async (id: number) => {
        const confirmed = await confirmDelete();
        if (confirmed) {
            deleteSocialLink(id);
        }
    };

    const handleBulkDelete = async () => {
        if (selectedRecords.length === 0) {
            toast.error("Please select items to delete");
            return;
        }

        const confirmed = await confirmDelete({
            title: "Delete Multiple Social Links",
            text: `Are you sure you want to delete ${selectedRecords.length} selected items?`,
        });

        if (confirmed) {
            bulkDeleteSocialLink(selectedRecords.map((record) => record.id));
        }
    };

    const columns: ColumnConfig<ISocialLink>[] = [
        {
            accessor: "id",
            title: "ID",
            type: "number",
            sortable: true,
            width: 70,
        },
        {
            accessor: "platform",
            title: "Platform",
            type: "text",
            sortable: true,
            render: ({ platform }) => (
                <div className="font-medium capitalize">{platform}</div>
            ),
        },
        {
            accessor: "url",
            title: "URL",
            type: "text",
            sortable: true,
            render: ({ url }) => (
                <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline"
                >
                    {url}
                </a>
            ),
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
                        setSocialLinkToEdit(record);
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

            <DataTableWithSidebar<ISocialLink>
                title="Social Link Table"
                columns={columns}
                fetchData={(params) => socialLinkApi.getAll(params)}
                searchFields={["platform", "url"]}
                sortCol="sort_order"
                query={{}}
                rowSelectionEnabled={true}
                onSelectionChange={setSelectedRecords}
                searchable={true}
                exportable={{
                    enabled: true,
                    name: "Social Links",
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
                            setSocialLinkToEdit(null);
                            setIsOpen(true);
                        }}
                    >
                        <Plus size={16} />
                        Add Social Link
                    </button>
                }
                showSidebar={showSidebar}
                sidebarTitle="Social Link Details"
                onCloseSidebar={closeSidebar}
                sidebarContent={<SocialLinkDetail socialLinkId={selectedSocialLinkId} />}
            />

            <SocialLinkModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                socialLinkToEdit={socialLinkToEdit}
            />
        </div>
    );
};

const SocialLinkList = () => {
    const { mode, isWebsiteContentArea } = useCmsContentMode();

    if (mode === "editor" && isWebsiteContentArea) {
        return <Navigate to="/editor/site-wide/social-links" replace />;
    }

    return <SocialLinkTable />;
};

export default SocialLinkList;
