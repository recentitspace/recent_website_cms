import React from "react";
import GenericModal from "../../../components/GenericModal";
import { IClient } from "../../../types";
import ClientForm from "./ClientForm";

interface ClientModalProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    clientToEdit?: IClient | null;
}

const ClientModal: React.FC<ClientModalProps> = ({ isOpen, setIsOpen, clientToEdit }) => {
    const isEditMode = Boolean(clientToEdit);

    return (
        <GenericModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title={isEditMode ? "Edit Client" : "Add Client"}
            maxWidth="lg"
        >
            <ClientForm clientToEdit={clientToEdit} onClose={() => setIsOpen(false)} />
        </GenericModal>
    );
};

export default ClientModal;
