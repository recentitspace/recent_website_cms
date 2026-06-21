import { ITimestamped } from "./common";
import { IMedia } from "./media";

export interface IAboutDriveItem extends ITimestamped {
    id: number;
    title: string;
    body?: string | null;
    image_id?: number | null;
    bullets?: string[] | null;
    sort_order: number;
    is_active: boolean;
    image?: IMedia | null;
}
