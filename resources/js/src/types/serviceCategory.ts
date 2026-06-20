import { ITimestamped } from "./common";
import { IMedia } from "./media";
import { IProcessStep } from "./processStep";

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
    process_title?: string | null;
    process_subtitle?: string | null;
    process_steps?: IProcessStep[] | null;
    sort_order: number;
    is_active: boolean;
    show_on_home: boolean;
    icon?: IMedia | null;
    hero_image?: IMedia | null;
}
