import { IconTrash } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import moment from "moment";
import { useState } from "react";
import { toast } from "sonner";
import Breadcrumb from "../../components/Breadcrumb";
import DataTableWithSidebar from "../../components/DataTableWithSidebar";
import FormSelect from "../../components/form/FormSelect";
import { useConfirmDialog, useSidebarDetail } from "../../hooks";
import { faqApi } from "../../services/faq";
import { serviceCategoryApi } from "../../services/serviceCategory";
import { ColumnConfig } from "../../types/columns";
import { IFaq } from "../../types";
import FaqDetail from "./components/FaqDetail";
import FaqModal from "./components/FaqModal";

const FaqList = () => {
    const queryClient = useQueryClient();
    const [selectedRecords, setSelectedRecords] = useState<IFaq[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [faqToEdit, setFaqToEdit] = useState<IFaq | null>(null);
    const [contextFilter, setContextFilter] = useState<string>("");

    const { data: categoriesResponse } = useQuery({
        queryKey: ["Service Categories Select"],
        queryFn: () =>
            serviceCategoryApi.getAll({
                per_page: 100,
                sort_by: "sort_order",
                sort_direction: "asc",
            }),
    });

    const contextFilterOptions = [
        { value: "", label: "All Contexts" },
        { value: "global", label: "FAQ Page" },
        ...(categoriesResponse?.data?.map((category) => ({
            value: String(category.id),
            label: category.title,
        })) || []),
    ];

    const {
        selectedId: selectedFaqId,
        showSidebar,
        openSidebar,
        closeSidebar,
    } = useSidebarDetail();

    const { confirmDelete } = useConfirmDialog();

    const { mutate: deleteFaq } = useMutation({
        mutationFn: (id: number) => faqApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["FAQ Table"] });
            toast.success("FAQ deleted successfully");
            if (selectedFaqId) {
                closeSidebar();
            }
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to delete FAQ");
        },
    });

    const { mutate: bulkDeleteFaq } = useMutation({
        mutationFn: (ids: number[]) => faqApi.bulkDelete(ids),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["FAQ Table"] });
            toast.success(`${data.deleted_count} FAQs deleted successfully`);
            if (selectedFaqId) {
                closeSidebar();
            }
            setSelectedRecords([]);
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to delete FAQs");
        },
    });

    const breadcrumbItems = [
        { title: "Dashboard", path: "/dashboard" },
        { title: "FAQs" },
    ];

    const handleDelete = async (id: number) => {
        const confirmed = await confirmDelete();
        if (confirmed) {
            deleteFaq(id);
        }
    };

    const handleBulkDelete = async () => {
        if (selectedRecords.length === 0) {
            toast.error("Please select items to delete");
            return;
        }

        const confirmed = await confirmDelete({
            title: "Delete Multiple FAQs",
            text: `Are you sure you want to delete ${selectedRecords.length} selected items?`,
        });

        if (confirmed) {
            bulkDeleteFaq(selectedRecords.map((record) => record.id));
        }
    };

    const columns: ColumnConfig<IFaq>[] = [
        {
            accessor: "id",
            title: "ID",
            type: "number",
            sortable: true,
            width: 70,
        },
        {
            accessor: "question",
            title: "Question",
            type: "text",
            sortable: true,
            render: ({ question }) => (
                <div className="max-w-xs truncate font-medium" title={question}>
                    {question}
                </div>
            ),
        },
        {
            accessor: "service_category_id",
            title: "Context",
            type: "text",
            sortable: false,
            render: ({ service_category }) => (
                <span className="font-medium">
                    {service_category?.title || "FAQ Page"}
                </span>
            ),
        },
        {
            accessor: "answer_paragraphs",
            title: "Answer",
            type: "text",
            sortable: false,
            render: ({ answer_paragraphs }) => (
                <div className="max-w-xs truncate" title={answer_paragraphs?.[0] || ""}>
                    {answer_paragraphs?.[0] || "-"}
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
                        setFaqToEdit(record);
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

            <DataTableWithSidebar<IFaq>
                title="FAQ Table"
                columns={columns}
                fetchData={(params) => faqApi.getAll(params)}
                searchFields={["question"]}
                sortCol="sort_order"
                query={
                    contextFilter === "global"
                        ? { service_category_id: { null: true } }
                        : contextFilter
                          ? { service_category_id: contextFilter }
                          : {}
                }
                rowSelectionEnabled={true}
                onSelectionChange={setSelectedRecords}
                searchable={true}
                exportable={{
                    enabled: true,
                    name: "FAQs",
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
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="w-56">
                            <FormSelect
                                label=""
                                value={contextFilter}
                                onChange={setContextFilter}
                                options={contextFilterOptions}
                            />
                        </div>
                        <button
                            type="button"
                            className="btn btn-primary gap-2"
                            onClick={() => {
                                setFaqToEdit(null);
                                setIsOpen(true);
                            }}
                        >
                            <Plus size={16} />
                            Add FAQ
                        </button>
                    </div>
                }
                showSidebar={showSidebar}
                sidebarTitle="FAQ Details"
                onCloseSidebar={closeSidebar}
                sidebarContent={<FaqDetail faqId={selectedFaqId} />}
            />

            <FaqModal isOpen={isOpen} setIsOpen={setIsOpen} faqToEdit={faqToEdit} />
        </div>
    );
};

export default FaqList;
