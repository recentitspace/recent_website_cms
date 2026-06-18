import React from "react";
import GenericModal from "../../../components/GenericModal";
import { IPageBlock } from "../../../types";
import PageBlockForm from "./PageBlockForm";

interface PageBlockModalProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    blockToEdit?: IPageBlock | null;
}

const PageBlockModal: React.FC<PageBlockModalProps> = ({ isOpen, setIsOpen, blockToEdit }) => {
    const isEditMode = Boolean(blockToEdit);

    return (
        <GenericModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title={isEditMode ? "Edit Page Block" : "Add Page Block"}
            maxWidth="xl"
        >
            <PageBlockForm blockToEdit={blockToEdit} onClose={() => setIsOpen(false)} />
        </GenericModal>
    );
};

export default PageBlockModal;
