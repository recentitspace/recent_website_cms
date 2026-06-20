import { ITimestamped } from "./common";
import { IServiceCategory } from "./serviceCategory";

export interface IFaq extends ITimestamped {
    id: number;
    service_category_id?: number | null;
    question: string;
    answer_paragraphs: string[];
    sort_order: number;
    is_active: boolean;
    service_category?: IServiceCategory | null;
}
