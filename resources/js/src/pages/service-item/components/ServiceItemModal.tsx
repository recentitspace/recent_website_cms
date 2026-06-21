import { Wrench } from "lucide-react";
import React from "react";

import GenericModal from "../../../components/GenericModal";
import { IServiceItem } from "../../../types";
import ServiceItemForm from "./ServiceItemForm";

interface ServiceItemModalProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    itemToEdit?: IServiceItem | null;
}

const ServiceItemModal: React.FC<ServiceItemModalProps> = ({
    isOpen,
    setIsOpen,
    itemToEdit,
}) => {
    const isEditMode = Boolean(itemToEdit);

    return (
        <GenericModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title={isEditMode ? "Edit service" : "Add service"}
            subtitle="Service listing and detail page content — headline, highlights, and process steps."
            icon={Wrench}
            maxWidth="3xl"
        >
            <ServiceItemForm itemToEdit={itemToEdit} onClose={() => setIsOpen(false)} />
        </GenericModal>
    );
};

export default ServiceItemModal;
