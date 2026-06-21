import { LayoutTemplate } from "lucide-react";
import React from "react";

import GenericModal from "../../../components/GenericModal";
import { IPageBlock } from "../../../types";
import { getPageBlockLabel } from "../../editor/lib/editorPageLabels";
import PageBlockForm from "./PageBlockForm";

interface PageBlockModalProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    blockToEdit?: IPageBlock | null;
}

const PageBlockModal: React.FC<PageBlockModalProps> = ({ isOpen, setIsOpen, blockToEdit }) => {
    const isEditMode = Boolean(blockToEdit);
    const blockLabel = blockToEdit ? getPageBlockLabel(blockToEdit.key) : null;

    return (
        <GenericModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title={isEditMode ? `Edit: ${blockLabel?.title || "Section"}` : "Add page section"}
            subtitle={
                isEditMode
                    ? blockLabel?.description
                    : "Create a new content section for a website page."
            }
            icon={LayoutTemplate}
            maxWidth="xl"
        >
            <PageBlockForm blockToEdit={blockToEdit} onClose={() => setIsOpen(false)} />
        </GenericModal>
    );
};

export default PageBlockModal;
