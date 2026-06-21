import { ChevronDown } from "lucide-react";
import React, { ReactNode, useState } from "react";

import { useSimpleFormMode } from "../../hooks/useSimpleFormMode";

interface FormAdvancedFieldsProps {
    children: ReactNode;
    title?: string;
}

const FormAdvancedFields: React.FC<FormAdvancedFieldsProps> = ({
    children,
    title = "More options",
}) => {
    const simpleMode = useSimpleFormMode();
    const [open, setOpen] = useState(false);

    if (!simpleMode) {
        return <div className="space-y-4">{children}</div>;
    }

    return (
        <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-600">
            <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300"
            >
                {title}
                <ChevronDown
                    size={16}
                    className={`transition-transform ${open ? "rotate-180" : ""}`}
                />
            </button>
            {open && <div className="space-y-4 border-t border-dashed border-gray-300 p-4 dark:border-gray-600">{children}</div>}
        </div>
    );
};

export default FormAdvancedFields;
