import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";

import FaqModal from "../faq/components/FaqModal";
import { faqApi } from "../../services/faq";
import { IFaq } from "../../types";
import EditorEntityListSection from "./components/EditorEntityListSection";
import PageEditorLayout from "./components/PageEditorLayout";

const EditorFaqPage = () => {
    const queryClient = useQueryClient();
    const [faqModalOpen, setFaqModalOpen] = useState(false);
    const [selectedFaq, setSelectedFaq] = useState<IFaq | null>(null);

    const { data: faqsResponse, isLoading } = useQuery({
        queryKey: ["editor-faq-page-questions"],
        queryFn: () =>
            faqApi.getAll({
                per_page: 100,
                sort_by: "sort_order",
                sort_direction: "asc",
                filter: { service_category_id: { null: true } },
            }),
    });

    const refresh = () => {
        queryClient.invalidateQueries({ queryKey: ["editor-faq-page-questions"] });
    };

    return (
        <>
            <PageEditorLayout page="faq">
                <EditorEntityListSection
                    title="Common questions"
                    description="Questions and answers on your main FAQ page. (Service-specific FAQs are edited on each service page.)"
                    items={faqsResponse?.data || []}
                    isLoading={isLoading}
                    emptyMessage="No questions on the FAQ page yet."
                    emptyHint="Add questions your visitors often ask, with clear short answers."
                    onAdd={() => {
                        setSelectedFaq(null);
                        setFaqModalOpen(true);
                    }}
                    onEdit={(faq) => {
                        setSelectedFaq(faq);
                        setFaqModalOpen(true);
                    }}
                    addLabel="Add question"
                    editLabel="Edit answer"
                    renderItem={(faq) => (
                        <div>
                            <p className="font-semibold text-gray-900 dark:text-white">
                                {faq.question}
                            </p>
                            <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                                {faq.answer_paragraphs?.[0]}
                            </p>
                        </div>
                    )}
                />
            </PageEditorLayout>

            <FaqModal
                isOpen={faqModalOpen}
                setIsOpen={(open) => {
                    setFaqModalOpen(open);
                    if (!open) {
                        setSelectedFaq(null);
                        refresh();
                    }
                }}
                faqToEdit={selectedFaq}
                defaultServiceCategoryId={null}
            />
        </>
    );
};

export default EditorFaqPage;
