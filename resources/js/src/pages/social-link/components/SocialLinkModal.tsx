import React from "react";
import GenericModal from "../../../components/GenericModal";
import { ISocialLink } from "../../../types";
import SocialLinkForm from "./SocialLinkForm";

interface SocialLinkModalProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    socialLinkToEdit?: ISocialLink | null;
}

const SocialLinkModal: React.FC<SocialLinkModalProps> = ({
    isOpen,
    setIsOpen,
    socialLinkToEdit,
}) => {
    const isEditMode = Boolean(socialLinkToEdit);

    return (
        <GenericModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title={isEditMode ? "Edit Social Link" : "Add Social Link"}
            maxWidth="lg"
        >
            <SocialLinkForm
                socialLinkToEdit={socialLinkToEdit}
                onClose={() => setIsOpen(false)}
            />
        </GenericModal>
    );
};

export default SocialLinkModal;
