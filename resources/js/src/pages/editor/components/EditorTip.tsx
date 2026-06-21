import { Info, Lightbulb } from "lucide-react";
import React from "react";

interface EditorTipProps {
    children: React.ReactNode;
    variant?: "info" | "help";
}

const EditorTip: React.FC<EditorTipProps> = ({ children, variant = "help" }) => {
    const Icon = variant === "info" ? Info : Lightbulb;

    return (
        <div className="flex gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3.5 text-sm leading-relaxed text-gray-700 dark:border-primary/30 dark:bg-primary/10 dark:text-gray-200">
            <Icon size={18} className="mt-0.5 shrink-0 text-primary" />
            <div>{children}</div>
        </div>
    );
};

export default EditorTip;
