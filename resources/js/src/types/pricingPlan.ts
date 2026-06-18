import { ITimestamped } from "./common";
import { IPricingSection } from "./pricingSection";

export interface IPricingPlanFeature {
    text: string;
    included: boolean;
    hidden: boolean;
}

export type PricingPlanStyle = "standard" | "featured" | "premium";

export interface IPricingPlan extends ITimestamped {
    id: number;
    pricing_section_id: number;
    name: string;
    price: string;
    price_period?: string | null;
    style: PricingPlanStyle;
    cta_text: string;
    cta_url?: string | null;
    features?: IPricingPlanFeature[];
    sort_order: number;
    is_active: boolean;
    section?: IPricingSection | null;
}
