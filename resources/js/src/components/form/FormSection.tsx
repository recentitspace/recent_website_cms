import React, { ReactNode } from "react";

interface FormSectionProps {
    title: string;
    description?: string;
    children: ReactNode;
}

const FormSection: React.FC<FormSectionProps> = ({ title, description, children }) => {
    return (
        <section className="rounded-xl border border-gray-200/80 bg-gray-50/50 p-4 dark:border-gray-700/60 dark:bg-black/20">
            <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h4>
                {description && (
                    <p className="mt-0.5 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                        {description}
                    </p>
                )}
            </div>
            <div className="space-y-4">{children}</div>
        </section>
    );
};

export default FormSection;
