import { Plus, Trash2 } from "lucide-react";
import React, { ReactNode } from "react";

interface FormFieldListProps {
    label: string;
    description?: string;
    addLabel?: string;
    emptyMessage?: string;
    onAdd: () => void;
    onRemove: (index: number) => void;
    itemCount: number;
    renderItem: (index: number) => ReactNode;
}

const FormFieldList: React.FC<FormFieldListProps> = ({
    label,
    description,
    addLabel = "Add",
    emptyMessage = "Nothing added yet.",
    onAdd,
    onRemove,
    itemCount,
    renderItem,
}) => {
    return (
        <div className="space-y-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
                    {description && (
                        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                            {description}
                        </p>
                    )}
                </div>
                <button
                    type="button"
                    className="btn btn-sm btn-outline-primary gap-1"
                    onClick={onAdd}
                >
                    <Plus size={14} />
                    {addLabel}
                </button>
            </div>

            {itemCount === 0 ? (
                <p className="rounded-lg border border-dashed border-gray-300 px-4 py-6 text-center text-sm text-gray-500 dark:border-gray-600">
                    {emptyMessage}
                </p>
            ) : (
                <div className="space-y-2">
                    {Array.from({ length: itemCount }).map((_, index) => (
                        <div
                            key={index}
                            className="flex items-start gap-2 rounded-lg border border-gray-200/80 bg-white p-2 dark:border-gray-700/60 dark:bg-black/20"
                        >
                            <div className="min-w-0 flex-1">{renderItem(index)}</div>
                            <button
                                type="button"
                                className="btn btn-sm btn-outline-danger shrink-0"
                                onClick={() => onRemove(index)}
                                aria-label={`Remove item ${index + 1}`}
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FormFieldList;
