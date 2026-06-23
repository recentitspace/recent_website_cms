import { Newspaper } from "lucide-react";
import React from "react";

import GenericModal from "../../../components/GenericModal";
import { IBlog } from "../../../types";
import BlogForm from "./BlogForm";

interface BlogModalProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    blogToEdit?: IBlog | null;
}

const BlogModal: React.FC<BlogModalProps> = ({ isOpen, setIsOpen, blogToEdit }) => {
    const isEditMode = Boolean(blogToEdit);

    return (
        <GenericModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title={isEditMode ? "Edit blog post" : "Add blog post"}
            subtitle="Articles for your blog pages and optional home page carousel."
            icon={Newspaper}
            maxWidth="lg"
        >
            <BlogForm blogToEdit={blogToEdit} onClose={() => setIsOpen(false)} />
        </GenericModal>
    );
};

export default BlogModal;
