import { ITimestamped } from "./common";
import { IMedia } from "./media";
import { IServiceCategory } from "./serviceCategory";

export interface IServiceItem extends ITimestamped {
    id: number;
    service_category_id: number;
    title: string;
    slug: string;
    icon_id?: number | null;
    page_path: string;
    highlights?: string[] | null;
    sort_order: number;
    is_active: boolean;
    show_on_home: boolean;
    category?: IServiceCategory | null;
    icon?: IMedia | null;
}
