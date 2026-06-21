import { ITimestamped } from "./common";
import { IMedia } from "./media";

export interface IWhyChooseItem extends ITimestamped {
    id: number;
    title: string;
    body?: string | null;
    icon_id?: number | null;
    sort_order: number;
    is_active: boolean;
    icon?: IMedia | null;
}
