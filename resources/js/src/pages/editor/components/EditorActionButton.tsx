import { LucideIcon, Pencil, Plus } from "lucide-react";
import React from "react";

type EditorActionVariant = "primary" | "outline" | "ghost";

interface EditorActionButtonProps {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
    variant?: EditorActionVariant;
    size?: "sm" | "md";
}

const variantClasses: Record<EditorActionVariant, string> = {
    primary: "btn btn-primary",
    outline: "btn btn-outline-primary",
    ghost: "btn btn-outline-primary border-transparent shadow-none hover:border-primary",
};

const EditorActionButton: React.FC<EditorActionButtonProps> = ({
    label,
    onClick,
    icon: Icon,
    variant = "outline",
    size = "sm",
}) => {
    const ResolvedIcon = Icon || (label.toLowerCase().includes("add") ? Plus : Pencil);

    return (
        <button
            type="button"
            className={`${variantClasses[variant]} ${size === "sm" ? "btn-sm" : ""} gap-2`}
            onClick={onClick}
        >
            <ResolvedIcon size={14} />
            {label}
        </button>
    );
};

export default EditorActionButton;
