import { Sparkles } from "lucide-react";
import React from "react";

import GenericModal from "../../../components/GenericModal";
import { IWhyChooseItem } from "../../../types";
import Form from "./Form";

interface ModalProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    itemToEdit?: IWhyChooseItem | null;
}

const Modal: React.FC<ModalProps> = ({ isOpen, setIsOpen, itemToEdit }) => {
    const isEditMode = Boolean(itemToEdit);

    return (
        <GenericModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title={isEditMode ? "Edit why choose item" : "Add why choose item"}
            subtitle="A feature card in the why-choose-us section."
            icon={Sparkles}
            maxWidth="lg"
        >
            <Form itemToEdit={itemToEdit} onClose={() => setIsOpen(false)} />
        </GenericModal>
    );
};

export default Modal;
