import React from "react";

import ActionButton from "../ActionButton";

interface FormFooterProps {
    onCancel: () => void;
    isSubmitting?: boolean;
    isEditMode?: boolean;
    saveLabel?: string;
    cancelLabel?: string;
}

const FormFooter: React.FC<FormFooterProps> = ({
    onCancel,
    isSubmitting = false,
    isEditMode = false,
    saveLabel,
    cancelLabel = "Cancel",
}) => {
    const resolvedSave = saveLabel || (isEditMode ? "Save changes" : "Add");

    return (
        <div className="sticky bottom-0 -mx-5 -mb-5 mt-6 flex flex-wrap justify-end gap-3 border-t border-gray-200 bg-white/95 px-5 py-4 backdrop-blur-sm dark:border-gray-700 dark:bg-[#202940]/95">
            <ActionButton
                type="button"
                variant="outline-danger"
                onClick={onCancel}
                isLoading={false}
                displayText={cancelLabel}
                disabled={isSubmitting}
            />
            <ActionButton
                type="submit"
                variant="primary"
                isLoading={isSubmitting}
                loadingText="Saving..."
                displayText={resolvedSave}
            />
        </div>
    );
};

export default FormFooter;
