import React from "react";
import GenericModal from "../../../components/GenericModal";
import { IFaq } from "../../../types";
import FaqForm from "./FaqForm";

interface FaqModalProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    faqToEdit?: IFaq | null;
}

const FaqModal: React.FC<FaqModalProps> = ({ isOpen, setIsOpen, faqToEdit }) => {
    const isEditMode = Boolean(faqToEdit);

    return (
        <GenericModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title={isEditMode ? "Edit FAQ" : "Add FAQ"}
            maxWidth="lg"
        >
            <FaqForm faqToEdit={faqToEdit} onClose={() => setIsOpen(false)} />
        </GenericModal>
    );
};

export default FaqModal;
