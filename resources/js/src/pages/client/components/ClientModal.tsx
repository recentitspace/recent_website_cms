import { Building2 } from "lucide-react";
import React from "react";

import GenericModal from "../../../components/GenericModal";
import { IClient } from "../../../types";
import ClientForm, { ClientLogoPlacement } from "./ClientForm";

interface ClientModalProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    clientToEdit?: IClient | null;
    placement?: ClientLogoPlacement;
}

const PLACEMENT_COPY: Record<
    ClientLogoPlacement,
    { subtitle: string; addTitle: string; editTitle: string }
> = {
    home: {
        subtitle: "Logo for the scrolling row on the homepage.",
        addTitle: "Add homepage logo",
        editTitle: "Edit homepage logo",
    },
    clients_page: {
        subtitle: "Logo for the Our Trusted Clients page grid.",
        addTitle: "Add clients page logo",
        editTitle: "Edit clients page logo",
    },
};

const ClientModal: React.FC<ClientModalProps> = ({
    isOpen,
    setIsOpen,
    clientToEdit,
    placement = "home",
}) => {
    const isEditMode = Boolean(clientToEdit);
    const copy = PLACEMENT_COPY[placement];

    return (
        <GenericModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title={isEditMode ? copy.editTitle : copy.addTitle}
            subtitle={copy.subtitle}
            icon={Building2}
            maxWidth="lg"
        >
            <ClientForm
                clientToEdit={clientToEdit}
                onClose={() => setIsOpen(false)}
                placement={placement}
            />
        </GenericModal>
    );
};

export default ClientModal;
