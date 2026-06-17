import React from "react";
import GenericModal from "../../../components/GenericModal";
import { IPortfolioItem } from "../../../types";
import PortfolioItemForm from "./PortfolioItemForm";

interface PortfolioItemModalProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    itemToEdit?: IPortfolioItem | null;
}

const PortfolioItemModal: React.FC<PortfolioItemModalProps> = ({
    isOpen,
    setIsOpen,
    itemToEdit,
}) => {
    const isEditMode = Boolean(itemToEdit);

    return (
        <GenericModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title={isEditMode ? "Edit Portfolio Item" : "Add Portfolio Item"}
            maxWidth="xl"
        >
            <PortfolioItemForm itemToEdit={itemToEdit} onClose={() => setIsOpen(false)} />
        </GenericModal>
    );
};

export default PortfolioItemModal;
