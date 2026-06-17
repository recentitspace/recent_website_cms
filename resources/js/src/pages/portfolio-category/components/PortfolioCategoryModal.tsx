import React from "react";
import GenericModal from "../../../components/GenericModal";
import { IPortfolioCategory } from "../../../types";
import PortfolioCategoryForm from "./PortfolioCategoryForm";

interface PortfolioCategoryModalProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    categoryToEdit?: IPortfolioCategory | null;
}

const PortfolioCategoryModal: React.FC<PortfolioCategoryModalProps> = ({
    isOpen,
    setIsOpen,
    categoryToEdit,
}) => {
    const isEditMode = Boolean(categoryToEdit);

    return (
        <GenericModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title={isEditMode ? "Edit Portfolio Category" : "Add Portfolio Category"}
            maxWidth="lg"
        >
            <PortfolioCategoryForm
                categoryToEdit={categoryToEdit}
                onClose={() => setIsOpen(false)}
            />
        </GenericModal>
    );
};

export default PortfolioCategoryModal;
