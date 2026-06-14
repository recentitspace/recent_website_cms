import React from "react";
import GenericModal from "../../../components/GenericModal";
import { IMedia } from "../../../types";
import MediaForm from "./MediaForm";

interface MediaModalProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    mediaToEdit?: IMedia | null;
}

const MediaModal: React.FC<MediaModalProps> = ({
    isOpen,
    setIsOpen,
    mediaToEdit,
}) => {
    const isEditMode = Boolean(mediaToEdit);

    return (
        <GenericModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title={isEditMode ? "Edit Media" : "Upload Media"}
            maxWidth="lg"
        >
            <MediaForm
                mediaToEdit={mediaToEdit}
                onClose={() => setIsOpen(false)}
            />
        </GenericModal>
    );
};

export default MediaModal;
