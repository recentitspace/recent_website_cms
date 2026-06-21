import { Inbox, Plus } from "lucide-react";
import React, { ReactNode } from "react";

interface EditorEmptyStateProps {
    message: string;
    hint?: string;
    onAction?: () => void;
    actionLabel?: string;
    icon?: ReactNode;
}

const EditorEmptyState: React.FC<EditorEmptyStateProps> = ({
    message,
    hint,
    onAction,
    actionLabel = "Add first item",
    icon,
}) => {
    return (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white-dark/30 bg-white-light/30 px-6 py-10 text-center dark:border-white/10 dark:bg-black/20">
            <div className="mb-3 rounded-full bg-primary/10 p-3 text-primary">
                {icon || <Inbox size={22} />}
            </div>
            <p className="font-medium text-gray-700 dark:text-gray-200">{message}</p>
            {hint && (
                <p className="mt-1 max-w-sm text-sm text-gray-500 dark:text-gray-400">{hint}</p>
            )}
            {onAction && (
                <button
                    type="button"
                    className="btn btn-primary btn-sm mt-4 gap-2"
                    onClick={onAction}
                >
                    <Plus size={14} />
                    {actionLabel}
                </button>
            )}
        </div>
    );
};

export default EditorEmptyState;
