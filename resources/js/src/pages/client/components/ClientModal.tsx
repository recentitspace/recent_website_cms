import { Building2 } from "lucide-react";
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
            title={isEditMode ? "Edit client logo" : "Add client logo"}
            subtitle="Upload a client or partner logo for the homepage."
            icon={Building2}
            maxWidth="lg"
        >
            <ClientForm clientToEdit={clientToEdit} onClose={() => setIsOpen(false)} />
        </GenericModal>
    );
};

export default ClientModal;
