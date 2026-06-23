import { IconTrash } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import moment from "moment";
import { useState } from "react";
import { toast } from "sonner";
import Breadcrumb from "../../components/Breadcrumb";
import DataTableWithSidebar from "../../components/DataTableWithSidebar";
import { useConfirmDialog, useSidebarDetail } from "../../hooks";
import { blogApi } from "../../services/blog";
import { ColumnConfig } from "../../types/columns";
import { IBlog } from "../../types";
import BlogDetail from "./components/BlogDetail";
import BlogModal from "./components/BlogModal";

const BlogList = () => {
    const queryClient = useQueryClient();
    const [selectedRecords, setSelectedRecords] = useState<IBlog[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [blogToEdit, setBlogToEdit] = useState<IBlog | null>(null);

    const {
        selectedId: selectedBlogId,
        showSidebar,
        openSidebar,
        closeSidebar,
    } = useSidebarDetail();

    const { confirmDelete } = useConfirmDialog();

    const { mutate: deleteBlog } = useMutation({
        mutationFn: (id: number) => blogApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["Blog Table"] });
            toast.success("Blog post deleted successfully");
            if (selectedBlogId) {
                closeSidebar();
            }
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to delete blog post");
        },
    });

    const { mutate: bulkDeleteBlog } = useMutation({
        mutationFn: (ids: number[]) => blogApi.bulkDelete(ids),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["Blog Table"] });
            toast.success(`${data.deleted_count} blog posts deleted successfully`);
            if (selectedBlogId) {
                closeSidebar();
            }
            setSelectedRecords([]);
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to delete blog posts");
        },
    });

    const breadcrumbItems = [
        { title: "Dashboard", path: "/dashboard" },
        { title: "Blogs" },
    ];

    const handleDelete = async (id: number) => {
        const confirmed = await confirmDelete();
        if (confirmed) {
            deleteBlog(id);
        }
    };

    const handleBulkDelete = async () => {
        if (selectedRecords.length === 0) {
            toast.error("Please select items to delete");
            return;
        }

        const confirmed = await confirmDelete({
            title: "Delete Multiple Blog Posts",
            text: `Are you sure you want to delete ${selectedRecords.length} selected items?`,
        });

        if (confirmed) {
            bulkDeleteBlog(selectedRecords.map((record) => record.id));
        }
    };

    const columns: ColumnConfig<IBlog>[] = [
        {
            accessor: "id",
            title: "ID",
            type: "number",
            sortable: true,
            width: 70,
        },
        {
            accessor: "title",
            title: "Title",
            type: "text",
            sortable: true,
            render: ({ title, featured_image }) => (
                <div className="flex items-center gap-2">
                    {featured_image?.url && (
                        <img
                            src={featured_image.url}
                            alt={title}
                            className="h-10 w-10 rounded object-cover"
                        />
                    )}
                    <div className="min-w-0">
                        <div className="font-medium">{title}</div>
                    </div>
                </div>
            ),
        },
        {
            accessor: "author_name",
            title: "Author",
            type: "text",
            sortable: true,
        },
        {
            accessor: "published_at",
            title: "Published",
            type: "date",
            sortable: true,
            render: ({ published_at }) => (
                <div>{published_at ? moment(published_at).format("MM/DD/YYYY") : "-"}</div>
            ),
        },
        {
            accessor: "show_on_home",
            title: "Home",
            type: "text",
            sortable: true,
            render: ({ show_on_home }) => (show_on_home ? "Yes" : "No"),
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
            accessor: "sort_order",
            title: "Order",
            type: "number",
            sortable: true,
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
                        setBlogToEdit(record);
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

            <DataTableWithSidebar<IBlog>
                title="Blog Table"
                columns={columns}
                fetchData={(params) => blogApi.getAll(params)}
                searchFields={["title", "slug", "excerpt", "author_name"]}
                sortCol="sort_order"
                query={{}}
                rowSelectionEnabled={true}
                onSelectionChange={setSelectedRecords}
                searchable={true}
                exportable={{
                    enabled: true,
                    name: "Blogs",
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
                            setBlogToEdit(null);
                            setIsOpen(true);
                        }}
                    >
                        <Plus size={16} />
                        Add Blog Post
                    </button>
                }
                showSidebar={showSidebar}
                sidebarTitle="Blog Post Details"
                onCloseSidebar={closeSidebar}
                sidebarContent={<BlogDetail blogId={selectedBlogId} />}
            />

            <BlogModal isOpen={isOpen} setIsOpen={setIsOpen} blogToEdit={blogToEdit} />
        </div>
    );
};

export default BlogList;
