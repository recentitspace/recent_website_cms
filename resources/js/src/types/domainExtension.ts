import { ITimestamped } from "./common";

export interface IDomainExtension extends ITimestamped {
    id: number;
    extension: string;
    price: string;
    period: string;
    badge?: string | null;
    sort_order: number;
    is_active: boolean;
}
