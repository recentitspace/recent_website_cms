import React from "react";
import GenericModal from "../../../components/GenericModal";
import { IServiceCategory } from "../../../types";
import ServiceCategoryForm from "./ServiceCategoryForm";

interface ServiceCategoryModalProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    categoryToEdit?: IServiceCategory | null;
}

const ServiceCategoryModal: React.FC<ServiceCategoryModalProps> = ({
    isOpen,
    setIsOpen,
    categoryToEdit,
}) => {
    const isEditMode = Boolean(categoryToEdit);

    return (
        <GenericModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title={isEditMode ? "Edit Service Category" : "Add Service Category"}
            maxWidth="lg"
        >
            <ServiceCategoryForm
                categoryToEdit={categoryToEdit}
                onClose={() => setIsOpen(false)}
            />
        </GenericModal>
    );
};

export default ServiceCategoryModal;
