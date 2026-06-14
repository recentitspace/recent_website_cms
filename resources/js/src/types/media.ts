import { ITimestamped } from "./common";
import { IUser } from "./user";

export interface IMedia extends ITimestamped {
    id: number;
    filename: string;
    original_name: string;
    mime_type: string;
    size: number;
    path: string;
    url: string;
    alt_text?: string | null;
    uploaded_by?: number | null;
    uploader?: IUser | null;
}

export interface IMediaFormData {
    file?: File;
    alt_text?: string | null;
}
