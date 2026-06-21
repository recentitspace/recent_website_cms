import { HelpCircle } from "lucide-react";
import React from "react";

import GenericModal from "../../../components/GenericModal";
import { IFaq } from "../../../types";
import FaqForm from "./FaqForm";

interface FaqModalProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    faqToEdit?: IFaq | null;
    defaultServiceCategoryId?: number | null;
}

const FaqModal: React.FC<FaqModalProps> = ({
    isOpen,
    setIsOpen,
    faqToEdit,
    defaultServiceCategoryId,
}) => {
    const isEditMode = Boolean(faqToEdit);

    return (
        <GenericModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title={isEditMode ? "Edit question" : "Add question"}
            subtitle="A question and answer shown in the FAQ accordion on your website."
            icon={HelpCircle}
            maxWidth="lg"
        >
            <FaqForm
                faqToEdit={faqToEdit}
                defaultServiceCategoryId={defaultServiceCategoryId}
                onClose={() => setIsOpen(false)}
            />
        </GenericModal>
    );
};

export default FaqModal;
