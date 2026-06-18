import React from "react";
import GenericModal from "../../../components/GenericModal";
import { IStatCounter } from "../../../types";
import StatCounterForm from "./StatCounterForm";

interface StatCounterModalProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    counterToEdit?: IStatCounter | null;
}

const StatCounterModal: React.FC<StatCounterModalProps> = ({
    isOpen,
    setIsOpen,
    counterToEdit,
}) => {
    const isEditMode = Boolean(counterToEdit);

    return (
        <GenericModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title={isEditMode ? "Edit Stat Counter" : "Add Stat Counter"}
            maxWidth="lg"
        >
            <StatCounterForm counterToEdit={counterToEdit} onClose={() => setIsOpen(false)} />
        </GenericModal>
    );
};

export default StatCounterModal;
