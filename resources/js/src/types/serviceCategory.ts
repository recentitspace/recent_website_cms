import { ITimestamped } from "./common";
import { IMedia } from "./media";

export interface IServiceCategory extends ITimestamped {
    id: number;
    title: string;
    slug: string;
    icon_id?: number | null;
    hero_image_id?: number | null;
    hero_title?: string | null;
    description?: string | null;
    listing_subtitle?: string | null;
    page_path: string;
    cta_text: string;
    sort_order: number;
    is_active: boolean;
    show_on_home: boolean;
    icon?: IMedia | null;
    hero_image?: IMedia | null;
}
