import React from "react";

interface EditorLoadingStateProps {
    message?: string;
}

const EditorLoadingState: React.FC<EditorLoadingStateProps> = ({
    message = "Loading content...",
}) => {
    return (
        <div className="space-y-4">
            <p className="text-sm text-gray-500">{message}</p>
            <div className="space-y-3">
                {[1, 2, 3].map((key) => (
                    <div
                        key={key}
                        className="animate-pulse rounded-xl border border-white-dark/20 p-5 dark:border-white/10"
                    >
                        <div className="mb-3 h-4 w-1/3 rounded bg-white-dark/20 dark:bg-white/10" />
                        <div className="mb-2 h-3 w-full rounded bg-white-dark/10 dark:bg-white/5" />
                        <div className="h-3 w-2/3 rounded bg-white-dark/10 dark:bg-white/5" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EditorLoadingState;
