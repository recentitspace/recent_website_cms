import { ITimestamped } from "./common";
import { IMedia } from "./media";
import { IProcessStep } from "./processStep";
import { IServiceCategory } from "./serviceCategory";

export interface IServiceItem extends ITimestamped {
    id: number;
    service_category_id: number;
    title: string;
    slug: string;
    icon_id?: number | null;
    page_path: string;
    detail_hero_title?: string | null;
    detail_hero_description?: string | null;
    hero_image_id?: number | null;
    highlights?: string[] | null;
    process_title?: string | null;
    process_subtitle?: string | null;
    process_steps?: IProcessStep[] | null;
    sort_order: number;
    is_active: boolean;
    show_on_home: boolean;
    category?: IServiceCategory | null;
    icon?: IMedia | null;
    hero_image?: IMedia | null;
}
