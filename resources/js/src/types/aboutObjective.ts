import { ITimestamped } from "./common";

export interface IAboutObjective extends ITimestamped {
    id: number;
    title: string;
    body?: string | null;
    sort_order: number;
    is_active: boolean;
}
