import React from "react";
import GenericModal from "../../../components/GenericModal";
import { ITestimonial } from "../../../types";
import TestimonialForm from "./TestimonialForm";

interface TestimonialModalProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    testimonialToEdit?: ITestimonial | null;
}

const TestimonialModal: React.FC<TestimonialModalProps> = ({
    isOpen,
    setIsOpen,
    testimonialToEdit,
}) => {
    const isEditMode = Boolean(testimonialToEdit);

    return (
        <GenericModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title={isEditMode ? "Edit Testimonial" : "Add Testimonial"}
            maxWidth="xl"
        >
            <TestimonialForm testimonialToEdit={testimonialToEdit} onClose={() => setIsOpen(false)} />
        </GenericModal>
    );
};

export default TestimonialModal;
