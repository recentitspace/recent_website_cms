import { DollarSign } from "lucide-react";
import React from "react";

import GenericModal from "../../../components/GenericModal";
import { IPricingSection } from "../../../types";
import PricingSectionForm from "./PricingSectionForm";

interface PricingSectionModalProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    sectionToEdit?: IPricingSection | null;
}

const PricingSectionModal: React.FC<PricingSectionModalProps> = ({
    isOpen,
    setIsOpen,
    sectionToEdit,
}) => {
    const isEditMode = Boolean(sectionToEdit);

    return (
        <GenericModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title={isEditMode ? "Edit pricing category" : "Add pricing category"}
            subtitle="A group that contains one or more pricing plans."
            icon={DollarSign}
            maxWidth="lg"
        >
            <PricingSectionForm
                sectionToEdit={sectionToEdit}
                onClose={() => setIsOpen(false)}
            />
        </GenericModal>
    );
};

export default PricingSectionModal;
