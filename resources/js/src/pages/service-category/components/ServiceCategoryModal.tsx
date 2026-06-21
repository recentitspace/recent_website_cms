import { Layers } from "lucide-react";
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
            title={isEditMode ? "Edit service page" : "Add service page"}
            subtitle="Page header, intro text, hero image, and process steps for this service group."
            icon={Layers}
            maxWidth="2xl"
        >
            <ServiceCategoryForm
                categoryToEdit={categoryToEdit}
                onClose={() => setIsOpen(false)}
            />
        </GenericModal>
    );
};

export default ServiceCategoryModal;
