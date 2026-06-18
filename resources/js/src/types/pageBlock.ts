import { ITimestamped } from "./common";
import { IMedia } from "./media";

export type PageName = "home" | "about" | "faq";

export interface IPageBlock extends ITimestamped {
    id: number;
    page: PageName;
    key: string;
    title?: string | null;
    subtitle?: string | null;
    body?: string | null;
    image_id?: number | null;
    cta_text?: string | null;
    cta_url?: string | null;
    cta_secondary_text?: string | null;
    cta_secondary_url?: string | null;
    video_url?: string | null;
    sort_order: number;
    is_active: boolean;
    image?: IMedia | null;
}
