import { ITimestamped } from "./common";
import { IMedia } from "./media";
import { IPortfolioCategory } from "./portfolioCategory";

export type PortfolioItemType = "image" | "project" | "video";

export interface IPortfolioItemImage {
    id: number;
    portfolio_item_id: number;
    media_id: number;
    sort_order: number;
    media?: IMedia | null;
}

export interface IPortfolioItem extends ITimestamped {
    id: number;
    portfolio_category_id: number;
    title: string;
    slug: string;
    tags?: string | null;
    type: PortfolioItemType;
    thumbnail_id?: number | null;
    external_link?: string | null;
    youtube_url?: string | null;
    featured: boolean;
    sort_order: number;
    is_published: boolean;
    show_on_home: boolean;
    home_sort_order?: number | null;
    category?: IPortfolioCategory | null;
    thumbnail?: IMedia | null;
    gallery_images?: IPortfolioItemImage[];
}
