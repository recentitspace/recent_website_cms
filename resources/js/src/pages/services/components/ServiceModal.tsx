import React from "react";
import { IService } from "../../../types/service";
import ServiceForm from "./ServiceForm";
import GenericModal from "../../../components/GenericModal";

interface ServiceModalProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    serviceToEdit?: IService | null;
    defaultParentId?: number | null;
    defaultType?: "category" | "service";
}

const ServiceModal: React.FC<ServiceModalProps> = ({
    isOpen,
    setIsOpen,
    serviceToEdit,
    defaultParentId,
    defaultType,
}) => {
    const isEditMode = Boolean(serviceToEdit);
    const isCategory = (serviceToEdit?.type || defaultType) === "category";

    return (
        <GenericModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title={
                isEditMode
                    ? `Edit ${isCategory ? "Category" : "Service"}`
                    : `New ${isCategory ? "Category" : "Service"}`
            }
            maxWidth="2xl"
        >
            <ServiceForm
                serviceToEdit={serviceToEdit}
                defaultParentId={defaultParentId}
                defaultType={defaultType}
                onClose={() => setIsOpen(false)}
            />
        </GenericModal>
    );
};

export default ServiceModal;
