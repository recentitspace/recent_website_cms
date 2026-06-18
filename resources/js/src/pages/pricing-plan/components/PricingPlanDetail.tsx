import { useQuery } from "@tanstack/react-query";
import React from "react";
import { pricingPlanApi } from "../../../services/pricingPlan";

interface PricingPlanDetailProps {
    planId: number | null;
}

const PricingPlanDetail: React.FC<PricingPlanDetailProps> = ({ planId }) => {
    const { data: plan, isLoading } = useQuery({
        queryKey: ["pricing-plan", planId],
        queryFn: () => (planId ? pricingPlanApi.getById(planId) : null),
        enabled: !!planId,
    });

    if (isLoading) {
        return null;
    }

    if (!plan) {
        return (
            <div className="flex h-full items-center justify-center">
                <p className="text-gray-500">No pricing plan selected</p>
            </div>
        );
    }

    const features = plan.features || [];

    return (
        <div className="space-y-4 text-sm">
            <div>
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <p className="text-gray-600 dark:text-gray-300">
                    {plan.price}
                    {plan.price_period ? ` / ${plan.price_period}` : ""}
                </p>
            </div>
            <div>
                <span className="font-medium text-gray-500">Section</span>
                <p>{plan.section?.title || "-"}</p>
            </div>
            <div>
                <span className="font-medium text-gray-500">Style</span>
                <p className="capitalize">{plan.style}</p>
            </div>
            {plan.cta_text && (
                <div>
                    <span className="font-medium text-gray-500">CTA</span>
                    <p>{plan.cta_text}</p>
                    {plan.cta_url && (
                        <a
                            href={plan.cta_url}
                            target="_blank"
                            rel="noreferrer"
                            className="block break-all text-primary hover:underline"
                        >
                            {plan.cta_url}
                        </a>
                    )}
                </div>
            )}
            <div>
                <span className="font-medium text-gray-500">Sort Order</span>
                <p>{plan.sort_order}</p>
            </div>
            <div>
                <span className="font-medium text-gray-500">Status</span>
                <p>{plan.is_active ? "Active" : "Inactive"}</p>
            </div>
            {features.length > 0 && (
                <div>
                    <span className="font-medium text-gray-500">Features</span>
                    <ul className="mt-2 space-y-1">
                        {features.map((feature, index) => (
                            <li key={index} className="flex items-start gap-2">
                                <span
                                    className={
                                        feature.included ? "text-success" : "text-gray-400"
                                    }
                                >
                                    {feature.included ? "✓" : "✗"}
                                </span>
                                <span className={feature.hidden ? "text-gray-400 italic" : ""}>
                                    {feature.text}
                                    {feature.hidden ? " (hidden)" : ""}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default PricingPlanDetail;
