import {
    IconBrandFacebook,
    IconBrandInstagram,
    IconBrandLinkedin,
    IconBrandTiktok,
    IconBrandX,
    IconBrandYoutube,
    IconLink,
} from "@tabler/icons-react";
import React from "react";

import { SocialPlatform } from "../../types";

const PLATFORM_META: Record<
    SocialPlatform,
    { icon: typeof IconBrandFacebook; className: string; label: string }
> = {
    facebook: {
        icon: IconBrandFacebook,
        className: "bg-[#1877F2]/10 text-[#1877F2]",
        label: "Facebook",
    },
    instagram: {
        icon: IconBrandInstagram,
        className: "bg-[#E4405F]/10 text-[#E4405F]",
        label: "Instagram",
    },
    tiktok: {
        icon: IconBrandTiktok,
        className: "bg-black/5 text-black dark:bg-white/10 dark:text-white",
        label: "TikTok",
    },
    linkedin: {
        icon: IconBrandLinkedin,
        className: "bg-[#0A66C2]/10 text-[#0A66C2]",
        label: "LinkedIn",
    },
    twitter: {
        icon: IconBrandX,
        className: "bg-black/5 text-black dark:bg-white/10 dark:text-white",
        label: "Twitter / X",
    },
    youtube: {
        icon: IconBrandYoutube,
        className: "bg-[#FF0000]/10 text-[#FF0000]",
        label: "YouTube",
    },
    other: {
        icon: IconLink,
        className: "bg-primary/10 text-primary",
        label: "Other",
    },
};

interface SocialPlatformIconProps {
    platform: SocialPlatform | string;
    size?: number;
    showLabel?: boolean;
    className?: string;
}

export const getSocialPlatformLabel = (platform: string): string =>
    PLATFORM_META[platform as SocialPlatform]?.label ||
    platform.charAt(0).toUpperCase() + platform.slice(1).replace("_", " ");

const SocialPlatformIcon: React.FC<SocialPlatformIconProps> = ({
    platform,
    size = 22,
    showLabel = false,
    className = "",
}) => {
    const meta = PLATFORM_META[platform as SocialPlatform] || PLATFORM_META.other;
    const Icon = meta.icon;

    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${meta.className}`}
            >
                <Icon size={size} stroke={1.5} />
            </div>
            {showLabel && (
                <span className="font-semibold text-gray-900 dark:text-white">{meta.label}</span>
            )}
        </div>
    );
};

export default SocialPlatformIcon;
