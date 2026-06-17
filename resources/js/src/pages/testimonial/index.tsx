import { IconTrash } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import moment from "moment";
import { useState } from "react";
import { toast } from "sonner";
import Breadcrumb from "../../components/Breadcrumb";
import DataTableWithSidebar from "../../components/DataTableWithSidebar";
import { useConfirmDialog, useSidebarDetail } from "../../hooks";
import { testimonialApi } from "../../services/testimonial";
import { ColumnConfig } from "../../types/columns";
import { ITestimonial } from "../../types";
import TestimonialDetail from "./components/TestimonialDetail";
import TestimonialModal from "./components/TestimonialModal";

const TestimonialList = () => {
    const queryClient = useQueryClient();
    const [selectedRecords, setSelectedRecords] = useState<ITestimonial[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [testimonialToEdit, setTestimonialToEdit] = useState<ITestimonial | null>(null);

    const {
        selectedId: selectedTestimonialId,
        showSidebar,
        openSidebar,
        closeSidebar,
    } = useSidebarDetail();

    const { confirmDelete } = useConfirmDialog();

    const { mutate: deleteTestimonial } = useMutation({
        mutationFn: (id: number) => testimonialApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["Testimonial Table"] });
            toast.success("Testimonial deleted successfully");
            if (selectedTestimonialId) {
                closeSidebar();
            }
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to delete testimonial");
        },
    });

    const { mutate: bulkDeleteTestimonial } = useMutation({
        mutationFn: (ids: number[]) => testimonialApi.bulkDelete(ids),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["Testimonial Table"] });
            toast.success(`${data.deleted_count} testimonials deleted successfully`);
            if (selectedTestimonialId) {
                closeSidebar();
            }
            setSelectedRecords([]);
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to delete testimonials");
        },
    });

    const breadcrumbItems = [
        { title: "Dashboard", path: "/dashboard" },
        { title: "Testimonials" },
    ];

    const handleDelete = async (id: number) => {
        const confirmed = await confirmDelete();
        if (confirmed) {
            deleteTestimonial(id);
        }
    };

    const handleBulkDelete = async () => {
        if (selectedRecords.length === 0) {
            toast.error("Please select items to delete");
            return;
        }

        const confirmed = await confirmDelete({
            title: "Delete Multiple Testimonials",
            text: `Are you sure you want to delete ${selectedRecords.length} selected items?`,
        });

        if (confirmed) {
            bulkDeleteTestimonial(selectedRecords.map((record) => record.id));
        }
    };

    const columns: ColumnConfig<ITestimonial>[] = [
        {
            accessor: "id",
            title: "ID",
            type: "number",
            sortable: true,
            width: 70,
        },
        {
            accessor: "author_name",
            title: "Author",
            type: "text",
            sortable: true,
            render: ({ author_name, author_role, avatar }) => (
                <div className="flex items-center gap-2">
                    {avatar?.url && (
                        <img
                            src={avatar.url}
                            alt={author_name}
                            className="h-8 w-8 rounded-full object-cover"
                        />
                    )}
                    <div>
                        <div className="font-medium">{author_name}</div>
                        {author_role && (
                            <div className="text-xs text-gray-500">{author_role}</div>
                        )}
                    </div>
                </div>
            ),
        },
        {
            accessor: "quote",
            title: "Quote",
            type: "text",
            sortable: false,
            render: ({ quote }) => (
                <div className="max-w-xs truncate" title={quote}>
                    {quote}
                </div>
            ),
        },
        {
            accessor: "sort_order",
            title: "Order",
            type: "number",
            sortable: true,
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
                        setTestimonialToEdit(record);
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

            <DataTableWithSidebar<ITestimonial>
                title="Testimonial Table"
                columns={columns}
                fetchData={(params) => testimonialApi.getAll(params)}
                searchFields={["quote", "author_name", "author_role"]}
                sortCol="sort_order"
                query={{}}
                rowSelectionEnabled={true}
                onSelectionChange={setSelectedRecords}
                searchable={true}
                exportable={{
                    enabled: true,
                    name: "Testimonials",
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
                            setTestimonialToEdit(null);
                            setIsOpen(true);
                        }}
                    >
                        <Plus size={16} />
                        Add Testimonial
                    </button>
                }
                showSidebar={showSidebar}
                sidebarTitle="Testimonial Details"
                onCloseSidebar={closeSidebar}
                sidebarContent={<TestimonialDetail testimonialId={selectedTestimonialId} />}
            />

            <TestimonialModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                testimonialToEdit={testimonialToEdit}
            />
        </div>
    );
};

export default TestimonialList;
