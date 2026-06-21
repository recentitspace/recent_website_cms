import { LucideIcon } from "lucide-react";
import React, { ReactNode } from "react";

import EditorTip from "./EditorTip";

interface EditorPageShellProps {
    title: string;
    subtitle?: string;
    icon?: LucideIcon;
    tip?: ReactNode;
    children: ReactNode;
}

const EditorPageShell: React.FC<EditorPageShellProps> = ({
    title,
    subtitle,
    icon: Icon,
    tip,
    children,
}) => {
    return (
        <div className="mx-auto max-w-5xl space-y-6">
            <div className="overflow-hidden rounded-2xl border border-white-dark/20 bg-gradient-to-br from-white via-white to-primary/5 shadow-sm dark:border-white/10 dark:from-black dark:via-black dark:to-primary/10">
                <div className="flex flex-wrap items-start gap-4 p-6 md:p-8">
                    {Icon && (
                        <div className="rounded-2xl bg-primary/10 p-4 text-primary shadow-inner">
                            <Icon size={28} strokeWidth={1.75} />
                        </div>
                    )}
                    <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                            Website content
                        </p>
                        <h1 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">
                            {title}
                        </h1>
                        {subtitle && (
                            <p className="mt-2 max-w-2xl text-base leading-relaxed text-gray-600 dark:text-gray-300">
                                {subtitle}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {tip && <EditorTip>{tip}</EditorTip>}

            <div className="space-y-5">{children}</div>
        </div>
    );
};

export default EditorPageShell;
