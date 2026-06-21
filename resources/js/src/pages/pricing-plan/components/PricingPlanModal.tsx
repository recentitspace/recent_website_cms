import { CreditCard } from "lucide-react";
import React from "react";

import GenericModal from "../../../components/GenericModal";
import { IPricingPlan } from "../../../types";
import PricingPlanForm from "./PricingPlanForm";

interface PricingPlanModalProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    planToEdit?: IPricingPlan | null;
    defaultPricingSectionId?: number | null;
}

const PricingPlanModal: React.FC<PricingPlanModalProps> = ({
    isOpen,
    setIsOpen,
    planToEdit,
    defaultPricingSectionId,
}) => {
    const isEditMode = Boolean(planToEdit);

    return (
        <GenericModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title={isEditMode ? "Edit pricing plan" : "Add pricing plan"}
            subtitle="A plan card with price, features, and an optional sign-up button."
            icon={CreditCard}
            maxWidth="2xl"
        >
            <PricingPlanForm
                planToEdit={planToEdit}
                defaultPricingSectionId={defaultPricingSectionId}
                onClose={() => setIsOpen(false)}
            />
        </GenericModal>
    );
};

export default PricingPlanModal;
