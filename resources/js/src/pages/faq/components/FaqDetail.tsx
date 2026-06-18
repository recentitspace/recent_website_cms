import { useQuery } from "@tanstack/react-query";
import React from "react";
import { faqApi } from "../../../services/faq";

interface FaqDetailProps {
    faqId: number | null;
}

const FaqDetail: React.FC<FaqDetailProps> = ({ faqId }) => {
    const { data: faq, isLoading } = useQuery({
        queryKey: ["faq", faqId],
        queryFn: () => (faqId ? faqApi.getById(faqId) : null),
        enabled: !!faqId,
    });

    if (isLoading) {
        return null;
    }

    if (!faq) {
        return (
            <div className="flex h-full items-center justify-center">
                <p className="text-gray-500">No FAQ selected</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 text-sm">
            <div>
                <h3 className="text-xl font-bold">{faq.question}</h3>
            </div>
            {faq.answer_paragraphs && faq.answer_paragraphs.length > 0 && (
                <div>
                    <span className="font-medium text-gray-500">Answer</span>
                    <div className="mt-1 space-y-2">
                        {faq.answer_paragraphs.map((paragraph, index) => (
                            <p key={index} className="whitespace-pre-wrap">
                                {paragraph}
                            </p>
                        ))}
                    </div>
                </div>
            )}
            <div>
                <span className="font-medium text-gray-500">Sort Order</span>
                <p>{faq.sort_order}</p>
            </div>
            <div>
                <span className="font-medium text-gray-500">Active</span>
                <p>{faq.is_active ? "Yes" : "No"}</p>
            </div>
        </div>
    );
};

export default FaqDetail;
