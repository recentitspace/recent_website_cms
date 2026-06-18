import React from "react";
import GenericModal from "../../../components/GenericModal";
import { IPricingPlan } from "../../../types";
import PricingPlanForm from "./PricingPlanForm";

interface PricingPlanModalProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    planToEdit?: IPricingPlan | null;
}

const PricingPlanModal: React.FC<PricingPlanModalProps> = ({
    isOpen,
    setIsOpen,
    planToEdit,
}) => {
    const isEditMode = Boolean(planToEdit);

    return (
        <GenericModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title={isEditMode ? "Edit Pricing Plan" : "Add Pricing Plan"}
            maxWidth="xl"
        >
            <PricingPlanForm planToEdit={planToEdit} onClose={() => setIsOpen(false)} />
        </GenericModal>
    );
};

export default PricingPlanModal;
