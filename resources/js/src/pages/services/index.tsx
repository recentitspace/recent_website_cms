import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronDown, ChevronRight, Edit, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import Breadcrumb from "../../components/Breadcrumb";
import { useConfirmDialog } from "../../hooks";
import { serviceApi } from "../../services/service";
import { IService } from "../../types/service";
import ServiceModal from "./components/ServiceModal";

const ServicesPage = () => {
    const queryClient = useQueryClient();
    const { confirmDelete } = useConfirmDialog();
    const [expanded, setExpanded] = useState<Record<number, boolean>>({});
    const [isOpen, setIsOpen] = useState(false);
    const [serviceToEdit, setServiceToEdit] = useState<IService | null>(null);
    const [defaultParentId, setDefaultParentId] = useState<number | null>(null);
    const [defaultType, setDefaultType] = useState<"category" | "service">("category");

    const { data: tree = [], isLoading } = useQuery({
        queryKey: ["services-tree"],
        queryFn: () => serviceApi.getTree(),
    });

    const { mutate: deleteService } = useMutation({
        mutationFn: (id: number) => serviceApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["services-tree"] });
            toast.success("Deleted successfully");
        },
        onError: (error: any) => toast.error(error?.message || "Delete failed"),
    });

    const { mutate: reorder } = useMutation({
        mutationFn: serviceApi.reorder.bind(serviceApi),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["services-tree"] }),
    });

    const toggleExpand = (id: number) => {
        setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const openCreate = (type: "category" | "service", parentId: number | null = null) => {
        setServiceToEdit(null);
        setDefaultType(type);
        setDefaultParentId(parentId);
        setIsOpen(true);
    };

    const openEdit = (service: IService) => {
        setServiceToEdit(service);
        setDefaultType(service.type);
        setDefaultParentId(service.parent_id ?? null);
        setIsOpen(true);
    };

    const handleDelete = async (service: IService) => {
        const confirmed = await confirmDelete();
        if (confirmed) deleteService(service.id);
    };

    const moveItem = (items: IService[], index: number, direction: -1 | 1) => {
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= items.length) return;

        const reordered = [...items];
        [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];

        reorder(
            reordered.map((item, sortIndex) => ({
                id: item.id,
                sort_order: sortIndex,
                parent_id: item.parent_id ?? null,
            }))
        );
    };

    const breadcrumbItems = [
        { title: "Dashboard", path: "/dashboard" },
        { title: "Services" },
    ];

    return (
        <div>
            <Breadcrumb items={breadcrumbItems} />

            <div className="panel mt-5">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                    <div>
                        <h5 className="font-semibold text-lg dark:text-white-light">Services</h5>
                        <p className="text-gray-500 text-sm">Manage service categories and child services for the website.</p>
                    </div>
                    <button type="button" className="btn btn-primary" onClick={() => openCreate("category")}>
                        <Plus size={16} className="mr-1" /> Add Category
                    </button>
                </div>

                {isLoading ? (
                    <p className="text-gray-500">Loading services...</p>
                ) : tree.length === 0 ? (
                    <p className="text-gray-500">No services yet. Add a category to get started.</p>
                ) : (
                    <div className="space-y-3">
                        {tree.map((category, categoryIndex) => (
                            <div key={category.id} className="border rounded-lg dark:border-gray-700">
                                <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900/40">
                                    <button type="button" onClick={() => toggleExpand(category.id)} className="p-1">
                                        {expanded[category.id] !== false ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                                    </button>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold">{category.name}</p>
                                        <p className="text-xs text-gray-500">/{category.slug} · {category.status}</p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => moveItem(tree, categoryIndex, -1)}>↑</button>
                                        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => moveItem(tree, categoryIndex, 1)}>↓</button>
                                        <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => openCreate("service", category.id)}>
                                            <Plus size={14} />
                                        </button>
                                        <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => openEdit(category)}>
                                            <Edit size={14} />
                                        </button>
                                        <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(category)}>
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>

                                {expanded[category.id] !== false && (
                                    <div className="divide-y dark:divide-gray-700">
                                        {(category.children ?? []).map((child, childIndex) => (
                                            <div key={child.id} className="flex items-center gap-2 p-3 pl-10">
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium">{child.name}</p>
                                                    <p className="text-xs text-gray-500">/{category.slug}/{child.slug} · {child.status}</p>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => moveItem(category.children ?? [], childIndex, -1)}>↑</button>
                                                    <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => moveItem(category.children ?? [], childIndex, 1)}>↓</button>
                                                    <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => openEdit(child)}>
                                                        <Edit size={14} />
                                                    </button>
                                                    <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(child)}>
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <ServiceModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                serviceToEdit={serviceToEdit}
                defaultParentId={defaultParentId}
                defaultType={defaultType}
            />
        </div>
    );
};

export default ServicesPage;
