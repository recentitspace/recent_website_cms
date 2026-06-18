import { ITimestamped } from "./common";

export interface IFaq extends ITimestamped {
    id: number;
    question: string;
    answer_paragraphs: string[];
    sort_order: number;
    is_active: boolean;
}
