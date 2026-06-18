import { ITimestamped } from "./common";
import { IMedia } from "./media";

export interface IStatCounter extends ITimestamped {
    id: number;
    label: string;
    value: string;
    suffix?: string | null;
    icon_id?: number | null;
    sort_order: number;
    is_active: boolean;
    show_on_home: boolean;
    icon?: IMedia | null;
}
