import { ITimestamped } from "./common";

export type SocialPlatform =
    | "facebook"
    | "instagram"
    | "tiktok"
    | "linkedin"
    | "twitter"
    | "youtube"
    | "other";

export interface ISocialLink extends ITimestamped {
    id: number;
    platform: SocialPlatform;
    url: string;
    sort_order: number;
    is_active: boolean;
}
