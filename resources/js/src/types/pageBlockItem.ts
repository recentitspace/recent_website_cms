import { ITimestamped } from "./common";
import { IMedia } from "./media";
import { IPageBlock } from "./pageBlock";

export interface IPageBlockItem extends ITimestamped {
    id: number;
    page_block_id: number;
    title: string;
    body?: string | null;
    image_id?: number | null;
    icon_id?: number | null;
    bullets?: string[] | null;
    sort_order: number;
    is_active: boolean;
    block?: IPageBlock | null;
    image?: IMedia | null;
    icon?: IMedia | null;
}
