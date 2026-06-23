import { PageName } from "../../../types";

export const PAGE_BLOCK_DISPLAY_ORDER: Record<PageName, string[]> = {
    home: [
        "home_hero",
        "home_services_header",
        "home_cta",
        "home_why_choose",
        "home_pricing_header",
        "home_case_studies_header",
        "home_testimonials_header",
        "home_blog_header",
    ],
    about: [
        "about_who_we_are",
        "about_what_drives_us",
        "about_objectives",
        "about_video",
    ],
    faq: ["faq_hero", "faq_section"],
    contact: ["contact_hero"],
    pricing: ["pricing_hero", "pricing_blog_header"],
};

export const sortPageBlocksForEditor = <T extends { key: string }>(
    page: PageName,
    blocks: T[]
): T[] => {
    const order = PAGE_BLOCK_DISPLAY_ORDER[page] || [];
    const rank = new Map(order.map((key, index) => [key, index]));

    return [...blocks].sort((a, b) => {
        const aRank = rank.get(a.key) ?? 999;
        const bRank = rank.get(b.key) ?? 999;

        if (aRank !== bRank) {
            return aRank - bRank;
        }

        return a.key.localeCompare(b.key);
    });
};

export const getPageBlockLabel = (key: string): { title: string; description?: string } => {
    const labels: Record<string, { title: string; description?: string }> = {
        home_hero: {
            title: "Hero banner",
            description: "Main headline and intro text at the top of the home page.",
        },
        home_services_header: {
            title: "Services section header",
            description: "Title and subtitle above the services list.",
        },
        home_cta: {
            title: "Call to action",
            description: "Promotional banner with buttons linking to other pages.",
        },
        home_why_choose: {
            title: "Why choose us",
            description: "Section intro plus feature cards shown below it.",
        },
        home_pricing_header: {
            title: "Pricing section header",
            description: "Title and subtitle above pricing categories on the home page.",
        },
        home_case_studies_header: {
            title: "Case studies header",
            description: "Title and subtitle above featured portfolio work.",
        },
        home_testimonials_header: {
            title: "Testimonials header",
            description: "Title and subtitle above client testimonials.",
        },
        home_blog_header: {
            title: "Blogs header",
            description: "Title and subtitle above the blog carousel on the home page.",
        },
        about_who_we_are: {
            title: "Who we are",
            description: "Company introduction with image and story text.",
        },
        about_what_drives_us: {
            title: "What drives us",
            description: "Vision, mission, and core values cards.",
        },
        about_objectives: {
            title: "Objectives",
            description: "Numbered company objectives with descriptions.",
        },
        about_video: {
            title: "Video section",
            description: "Embedded video shown on the about page.",
        },
        faq_hero: {
            title: "FAQ page hero",
            description: "Headline and intro at the top of the FAQ page.",
        },
        faq_section: {
            title: "FAQ section header",
            description: "Title shown above the questions list.",
        },
        contact_hero: {
            title: "Contact page hero",
            description: "Headline and intro on the contact page. Address, phone, and email come from Site Settings.",
        },
        pricing_hero: {
            title: "Pricing page hero",
            description: "Headline and intro at the top of the pricing page.",
        },
        pricing_blog_header: {
            title: "Pricing page blog section",
            description: "Title and subtitle above the blog carousel on the pricing page.",
        },
    };

    return (
        labels[key] || {
            title: key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()),
        }
    );
};

export const PAGE_EDITOR_TITLES: Record<PageName, { title: string; subtitle: string }> = {
    home: {
        title: "Home page",
        subtitle: "Edit the sections visitors see on your homepage, from the hero to the blog carousel.",
    },
    about: {
        title: "About page",
        subtitle: "Tell your company story, values, objectives, and video content.",
    },
    faq: {
        title: "FAQ page",
        subtitle: "Manage the FAQ page hero and the questions shown on the standalone FAQ page.",
    },
    contact: {
        title: "Contact page",
        subtitle: "Edit contact page messaging. Contact details (address, phone, email) are managed under Site-wide settings.",
    },
    pricing: {
        title: "Pricing page",
        subtitle: "Edit the pricing page hero and blog section headings. Packages are managed under Pricing sections.",
    },
};
