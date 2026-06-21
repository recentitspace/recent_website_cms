import { Rocket } from "lucide-react";
import React from "react";

import GenericModal from "../../../components/GenericModal";
import { IAboutDriveItem } from "../../../types";
import Form from "./Form";

interface ModalProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    itemToEdit?: IAboutDriveItem | null;
}

const Modal: React.FC<ModalProps> = ({ isOpen, setIsOpen, itemToEdit }) => {
    const isEditMode = Boolean(itemToEdit);

    return (
        <GenericModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title={isEditMode ? "Edit about drive item" : "Add about drive item"}
            subtitle="A card in the about page drive section with optional bullet points."
            icon={Rocket}
            maxWidth="lg"
        >
            <Form itemToEdit={itemToEdit} onClose={() => setIsOpen(false)} />
        </GenericModal>
    );
};

export default Modal;
