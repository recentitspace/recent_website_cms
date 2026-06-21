import { LayoutGrid, PenLine } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";

import { useCmsContentMode, CmsContentMode } from "../../contexts/CmsContentModeContext";

const ContentModeToggle: React.FC = () => {
    const { t } = useTranslation();
    const { mode, setMode, isWebsiteContentArea } = useCmsContentMode();

    if (!isWebsiteContentArea) {
        return null;
    }

    const options: {
        value: CmsContentMode;
        label: string;
        hint: string;
        icon: typeof PenLine;
    }[] = [
        {
            value: "editor",
            label: t("cms_mode_editor"),
            hint: "Simple page view",
            icon: PenLine,
        },
        {
            value: "advanced",
            label: t("cms_mode_advanced"),
            hint: "Full data tables",
            icon: LayoutGrid,
        },
    ];

    return (
        <div
            className="flex items-center rounded-full border border-white-dark/20 bg-white-light/50 p-1 dark:border-white/10 dark:bg-black/20"
            title="Switch between simple page editing and advanced tables"
        >
            {options.map((option) => {
                const Icon = option.icon;
                const active = mode === option.value;

                return (
                    <button
                        key={option.value}
                        type="button"
                        onClick={() => setMode(option.value)}
                        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                            active
                                ? "bg-primary text-white shadow"
                                : "text-gray-600 hover:text-primary dark:text-gray-300"
                        }`}
                        title={option.hint}
                    >
                        <Icon size={13} />
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
};

export default ContentModeToggle;
