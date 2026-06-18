import React from "react";
import GenericModal from "../../../components/GenericModal";
import { IPageBlockItem } from "../../../types";
import PageBlockItemForm from "./PageBlockItemForm";

interface PageBlockItemModalProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    itemToEdit?: IPageBlockItem | null;
}

const PageBlockItemModal: React.FC<PageBlockItemModalProps> = ({
    isOpen,
    setIsOpen,
    itemToEdit,
}) => {
    const isEditMode = Boolean(itemToEdit);

    return (
        <GenericModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title={isEditMode ? "Edit Page Block Item" : "Add Page Block Item"}
            maxWidth="xl"
        >
            <PageBlockItemForm itemToEdit={itemToEdit} onClose={() => setIsOpen(false)} />
        </GenericModal>
    );
};

export default PageBlockItemModal;
