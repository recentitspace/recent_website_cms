import { ITimestamped } from "./common";
import { IMedia } from "./media";

export interface ISiteSetting extends ITimestamped {
    id?: number;
    site_name?: string | null;
    tagline?: string | null;
    copyright_text?: string | null;
    whatsapp_number?: string | null;
    whatsapp_label?: string | null;
    contact_email?: string | null;
    phone?: string | null;
    address?: string | null;
    notification_email?: string | null;
    logo_light_id?: number | null;
    logo_dark_id?: number | null;
    favicon_id?: number | null;
    logo_light?: IMedia | null;
    logo_dark?: IMedia | null;
    favicon?: IMedia | null;
}
