import { ITimestamped } from "./common";
import { IMedia } from "./media";

export interface IClient extends ITimestamped {
    id: number;
    name: string;
    logo_id?: number | null;
    url?: string | null;
    sort_order: number;
    is_active: boolean;
    show_on_home: boolean;
    logo?: IMedia | null;
}
