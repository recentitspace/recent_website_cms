import { Target } from "lucide-react";
import React from "react";

import GenericModal from "../../../components/GenericModal";
import { IAboutObjective } from "../../../types";
import Form from "./Form";

interface ModalProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    objectiveToEdit?: IAboutObjective | null;
}

const Modal: React.FC<ModalProps> = ({ isOpen, setIsOpen, objectiveToEdit }) => {
    const isEditMode = Boolean(objectiveToEdit);

    return (
        <GenericModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title={isEditMode ? "Edit about objective" : "Add about objective"}
            subtitle="A goal or objective shown on the about page."
            icon={Target}
            maxWidth="lg"
        >
            <Form objectiveToEdit={objectiveToEdit} onClose={() => setIsOpen(false)} />
        </GenericModal>
    );
};

export default Modal;
