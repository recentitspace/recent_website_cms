import { ITimestamped } from "./common";

export interface IPricingSection extends ITimestamped {
    id: number;
    title: string;
    slug: string;
    tab_label?: string | null;
    subtitle?: string | null;
    sort_order: number;
    is_active: boolean;
    show_on_home: boolean;
}
