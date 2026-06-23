import { ITimestamped } from "./common";
import { IMedia } from "./media";

export interface IBlog extends ITimestamped {
    id: number;
    title: string;
    slug: string;
    excerpt?: string | null;
    body_paragraphs?: string[] | null;
    author_name?: string | null;
    featured_image_id?: number | null;
    published_at?: string | null;
    external_link?: string | null;
    tags?: string[] | null;
    sort_order: number;
    home_sort_order?: number | null;
    is_active: boolean;
    show_on_home: boolean;
    featured_image?: IMedia | null;
}
