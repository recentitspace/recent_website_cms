import { IconTrash } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Upload } from "lucide-react";
import moment from "moment";
import { useState } from "react";
import { toast } from "sonner";
import Breadcrumb from "../../components/Breadcrumb";
import DataTableWithSidebar from "../../components/DataTableWithSidebar";
import { useConfirmDialog, useSidebarDetail } from "../../hooks";
import { mediaApi } from "../../services/media";
import { ColumnConfig } from "../../types/columns";
import { IMedia } from "../../types";
import MediaDetail from "./components/MediaDetail";
import MediaModal from "./components/MediaModal";

const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) {
        return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const MediaList = () => {
    const queryClient = useQueryClient();
    const [selectedRecords, setSelectedRecords] = useState<IMedia[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [mediaToEdit, setMediaToEdit] = useState<IMedia | null>(null);

    const {
        selectedId: selectedMediaId,
        showSidebar,
        openSidebar,
        closeSidebar,
    } = useSidebarDetail();

    const { confirmDelete } = useConfirmDialog();

    const { mutate: deleteMedia } = useMutation({
        mutationFn: (id: number) => mediaApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["Media Table"] });
            toast.success("Media deleted successfully");

            if (selectedMediaId) {
                closeSidebar();
            }
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to delete media");
        },
    });

    const { mutate: bulkDeleteMedia } = useMutation({
        mutationFn: (ids: number[]) => mediaApi.bulkDelete(ids),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["Media Table"] });
            toast.success(`${data.deleted_count} media items deleted successfully`);

            if (selectedMediaId) {
                closeSidebar();
            }
            setSelectedRecords([]);
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to delete media items");
        },
    });

    const breadcrumbItems = [
        { title: "Dashboard", path: "/dashboard" },
        { title: "Media Library" },
    ];

    const handleDelete = async (id: number) => {
        const confirmed = await confirmDelete({
            title: "Delete Media",
            text: "This will permanently delete the file from the server.",
        });

        if (confirmed) {
            deleteMedia(id);
        }
    };

    const handleBulkDelete = async () => {
        if (selectedRecords.length === 0) {
            toast.error("Please select items to delete");
            return;
        }

        const confirmed = await confirmDelete({
            title: "Delete Multiple Media Items",
            text: `Are you sure you want to permanently delete ${selectedRecords.length} selected items?`,
        });

        if (confirmed) {
            bulkDeleteMedia(selectedRecords.map((record) => record.id));
        }
    };

    const openUploadModal = () => {
        setMediaToEdit(null);
        setIsOpen(true);
    };

    const openEditModal = (media: IMedia) => {
        setMediaToEdit(media);
        setIsOpen(true);
    };

    const columns: ColumnConfig<IMedia>[] = [
        {
            accessor: "id",
            title: "ID",
            type: "number",
            sortable: true,
            width: 70,
        },
        {
            accessor: "url",
            title: "Preview",
            type: "text",
            sortable: false,
            width: 100,
            render: (record) => (
                <img
                    src={record.url}
                    alt={record.alt_text || record.original_name}
                    className="h-12 w-12 rounded object-cover"
                />
            ),
        },
        {
            accessor: "original_name",
            title: "Name",
            type: "text",
            sortable: true,
            render: ({ original_name }) => (
                <div className="font-medium">{original_name}</div>
            ),
        },
        {
            accessor: "mime_type",
            title: "Type",
            type: "text",
            sortable: true,
        },
        {
            accessor: "size",
            title: "Size",
            type: "text",
            sortable: true,
            render: ({ size }) => <div>{formatFileSize(size)}</div>,
        },
        {
            accessor: "created_at",
            title: "Uploaded",
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
                    onClick: (record) => openEditModal(record),
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

            <DataTableWithSidebar<IMedia>
                title="Media Table"
                columns={columns}
                fetchData={(params) => mediaApi.getAll(params)}
                searchFields={["original_name", "filename", "alt_text"]}
                sortCol="created_at"
                query={{}}
                rowSelectionEnabled={true}
                onSelectionChange={setSelectedRecords}
                searchable={true}
                exportable={{
                    enabled: true,
                    name: "Media",
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
                        onClick={openUploadModal}
                    >
                        <Upload size={16} />
                        Upload Media
                    </button>
                }
                showSidebar={showSidebar}
                sidebarTitle="Media Details"
                onCloseSidebar={closeSidebar}
                sidebarContent={<MediaDetail mediaId={selectedMediaId} />}
            />

            <MediaModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                mediaToEdit={mediaToEdit}
            />
        </div>
    );
};

export default MediaList;
