import { Globe } from "lucide-react";
import React from "react";

import GenericModal from "../../../components/GenericModal";
import { IDomainExtension } from "../../../types";
import DomainExtensionForm from "./DomainExtensionForm";

interface DomainExtensionModalProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    extensionToEdit?: IDomainExtension | null;
}

const DomainExtensionModal: React.FC<DomainExtensionModalProps> = ({
    isOpen,
    setIsOpen,
    extensionToEdit,
}) => {
    const isEditMode = Boolean(extensionToEdit);

    return (
        <GenericModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title={isEditMode ? "Edit domain extension" : "Add domain extension"}
            subtitle="Domain name pricing rows (e.g. .com — $15/yr)."
            icon={Globe}
            maxWidth="lg"
        >
            <DomainExtensionForm
                extensionToEdit={extensionToEdit}
                onClose={() => setIsOpen(false)}
            />
        </GenericModal>
    );
};

export default DomainExtensionModal;
