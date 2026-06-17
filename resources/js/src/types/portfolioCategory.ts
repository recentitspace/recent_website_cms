import { ITimestamped } from "./common";

export interface IPortfolioCategory extends ITimestamped {
    id: number;
    name: string;
    slug: string;
    sort_order: number;
    is_active: boolean;
}
