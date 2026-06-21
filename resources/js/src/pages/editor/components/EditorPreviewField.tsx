import React, { ReactNode } from "react";

interface EditorPreviewFieldProps {
    label: string;
    children: ReactNode;
    muted?: boolean;
}

const EditorPreviewField: React.FC<EditorPreviewFieldProps> = ({
    label,
    children,
    muted = false,
}) => {
    return (
        <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                {label}
            </p>
            <div
                className={
                    muted
                        ? "text-sm text-gray-600 dark:text-gray-300"
                        : "text-base font-medium text-gray-800 dark:text-gray-100"
                }
            >
                {children}
            </div>
        </div>
    );
};

export default EditorPreviewField;
