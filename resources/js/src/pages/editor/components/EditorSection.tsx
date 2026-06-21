import { LucideIcon } from "lucide-react";
import React, { ReactNode } from "react";

interface EditorSectionProps {
    title: string;
    description?: string;
    action?: ReactNode;
    icon?: LucideIcon;
    sectionNumber?: number;
    badge?: string;
    children: ReactNode;
}

const EditorSection: React.FC<EditorSectionProps> = ({
    title,
    description,
    action,
    icon: Icon,
    sectionNumber,
    badge,
    children,
}) => {
    return (
        <section className="overflow-hidden rounded-2xl border border-white-dark/20 bg-white shadow-sm dark:border-white/10 dark:bg-black">
            <div className="border-b border-white-dark/15 bg-white-light/40 px-5 py-4 dark:border-white/10 dark:bg-white/5 md:px-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex min-w-0 items-start gap-3">
                        {sectionNumber !== undefined && (
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white shadow-primary/30">
                                {sectionNumber}
                            </span>
                        )}
                        {Icon && !sectionNumber && (
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <Icon size={16} />
                            </span>
                        )}
                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {title}
                                </h3>
                                {badge && (
                                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                                        {badge}
                                    </span>
                                )}
                            </div>
                            {description && (
                                <p className="mt-1 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                                    {description}
                                </p>
                            )}
                        </div>
                    </div>
                    {action}
                </div>
            </div>
            <div className="p-5 md:p-6">{children}</div>
        </section>
    );
};

export default EditorSection;
