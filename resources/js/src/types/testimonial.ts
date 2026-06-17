import { ITimestamped } from "./common";
import { IMedia } from "./media";

export interface ITestimonial extends ITimestamped {
    id: number;
    quote: string;
    author_name: string;
    author_role?: string | null;
    logo_light_id?: number | null;
    logo_dark_id?: number | null;
    avatar_id?: number | null;
    sort_order: number;
    is_active: boolean;
    show_on_home: boolean;
    logo_light?: IMedia | null;
    logo_dark?: IMedia | null;
    avatar?: IMedia | null;
}
