import React from "react";

interface FormToggleProps {
    label: string;
    description?: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}

const FormToggle: React.FC<FormToggleProps> = ({
    label,
    description,
    checked,
    onChange,
}) => {
    return (
        <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-gray-200/80 bg-white px-4 py-3 transition hover:border-primary/30 dark:border-gray-700/60 dark:bg-black/20">
            <div className="min-w-0">
                <span className="block text-sm font-medium text-gray-900 dark:text-white">
                    {label}
                </span>
                {description && (
                    <span className="mt-0.5 block text-xs text-gray-500 dark:text-gray-400">
                        {description}
                    </span>
                )}
            </div>
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                onClick={() => onChange(!checked)}
                className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                    checked ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"
                }`}
            >
                <span
                    className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                        checked ? "translate-x-5" : "translate-x-0"
                    }`}
                />
            </button>
        </label>
    );
};

export default FormToggle;
