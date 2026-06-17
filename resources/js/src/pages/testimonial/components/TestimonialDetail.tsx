import { useQuery } from "@tanstack/react-query";
import React from "react";
import { testimonialApi } from "../../../services/testimonial";

interface TestimonialDetailProps {
    testimonialId: number | null;
}

const TestimonialDetail: React.FC<TestimonialDetailProps> = ({ testimonialId }) => {
    const { data: testimonial, isLoading } = useQuery({
        queryKey: ["testimonial", testimonialId],
        queryFn: () => (testimonialId ? testimonialApi.getById(testimonialId) : null),
        enabled: !!testimonialId,
    });

    if (isLoading) {
        return null;
    }

    if (!testimonial) {
        return (
            <div className="flex h-full items-center justify-center">
                <p className="text-gray-500">No testimonial selected</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 text-sm">
            <div>
                <span className="font-medium text-gray-500">Quote</span>
                <p className="mt-1">{testimonial.quote}</p>
            </div>
            <div>
                <h3 className="text-xl font-bold">{testimonial.author_name}</h3>
                {testimonial.author_role && (
                    <p className="text-gray-600 dark:text-gray-300">{testimonial.author_role}</p>
                )}
            </div>
            <div className="flex flex-wrap gap-3">
                {testimonial.avatar?.url && (
                    <div>
                        <span className="font-medium text-gray-500">Avatar</span>
                        <img
                            src={testimonial.avatar.url}
                            alt={testimonial.author_name}
                            className="mt-1 h-12 w-12 rounded-full object-cover"
                        />
                    </div>
                )}
                {testimonial.logo_light?.url && (
                    <div>
                        <span className="font-medium text-gray-500">Logo (light)</span>
                        <img
                            src={testimonial.logo_light.url}
                            alt="Light logo"
                            className="mt-1 h-10 object-contain"
                        />
                    </div>
                )}
                {testimonial.logo_dark?.url && (
                    <div>
                        <span className="font-medium text-gray-500">Logo (dark)</span>
                        <img
                            src={testimonial.logo_dark.url}
                            alt="Dark logo"
                            className="mt-1 h-10 object-contain"
                        />
                    </div>
                )}
            </div>
            <div>
                <span className="font-medium text-gray-500">Sort Order</span>
                <p>{testimonial.sort_order}</p>
            </div>
            <div>
                <span className="font-medium text-gray-500">Show on Home</span>
                <p>{testimonial.show_on_home ? "Yes" : "No"}</p>
            </div>
            <div>
                <span className="font-medium text-gray-500">Active</span>
                <p>{testimonial.is_active ? "Yes" : "No"}</p>
            </div>
        </div>
    );
};

export default TestimonialDetail;
