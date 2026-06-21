const ADVANCED_WEBSITE_PATHS = [
    "/site-settings",
    "/social-links",
    "/media",
    "/portfolio-categories",
    "/portfolio-items",
    "/clients",
    "/testimonials",
    "/pricing-sections",
    "/pricing-plans",
    "/service-categories",
    "/service-items",
    "/faqs",
    "/stat-counters",
    "/page-blocks",
    "/why-choose-items",
    "/about-drive-items",
    "/about-objectives",
];

const EDITOR_WEBSITE_PREFIX = "/editor";

const SERVICE_SLUG_MAP: Record<string, string> = {
    "/service-categories": "/editor/services/business-automation",
    "/service-items": "/editor/services/business-automation",
};

const EDITOR_TO_ADVANCED: Record<string, string> = {
    "/editor": "/site-settings",
    "/editor/site-wide": "/site-settings",
    "/editor/site-wide/social-links": "/social-links",
    "/editor/site-wide/media": "/media",
    "/editor/home": "/page-blocks",
    "/editor/about": "/page-blocks",
    "/editor/pricing": "/pricing-sections",
    "/editor/portfolio": "/portfolio-categories",
    "/editor/faq": "/faqs",
    "/editor/contact": "/page-blocks",
    "/editor/services/business-automation": "/service-categories",
    "/editor/services/business-presence": "/service-categories",
    "/editor/services/consulting-analyzing": "/service-categories",
};

export const isEditorRoute = (pathname: string): boolean =>
    pathname === EDITOR_WEBSITE_PREFIX || pathname.startsWith(`${EDITOR_WEBSITE_PREFIX}/`);

export const isWebsiteContentRoute = (pathname: string): boolean =>
    isEditorRoute(pathname) ||
    ADVANCED_WEBSITE_PATHS.some(
        (path) => pathname === path || pathname.startsWith(`${path}/`)
    );

export const getEditorRedirectPath = (pathname: string): string => {
    if (isEditorRoute(pathname)) {
        return pathname;
    }

    if (SERVICE_SLUG_MAP[pathname]) {
        return SERVICE_SLUG_MAP[pathname];
    }

    if (pathname.startsWith("/portfolio")) {
        return "/editor/portfolio";
    }

    if (pathname.startsWith("/pricing")) {
        return "/editor/pricing";
    }

    if (pathname.startsWith("/why-choose")) {
        return "/editor/home";
    }

    if (pathname.startsWith("/about-drive") || pathname.startsWith("/about-objective")) {
        return "/editor/about";
    }

    if (pathname.startsWith("/page-block")) {
        if (pathname.includes("contact") || pathname.includes("faq")) {
            return "/editor/contact";
        }

        return "/editor/home";
    }

    if (pathname.startsWith("/stat-counter")) {
        return "/editor/home";
    }

    if (pathname === "/faqs") {
        return "/editor/faq";
    }

    if (pathname === "/clients" || pathname === "/testimonials") {
        return "/editor/home";
    }

    if (pathname === "/site-settings") {
        return "/editor/site-wide";
    }

    if (pathname === "/social-links") {
        return "/editor/site-wide/social-links";
    }

    if (pathname === "/media") {
        return "/editor/site-wide/media";
    }

    return "/editor";
};

export const getAdvancedRedirectPath = (pathname: string): string => {
    if (EDITOR_TO_ADVANCED[pathname]) {
        return EDITOR_TO_ADVANCED[pathname];
    }

    if (pathname.startsWith("/editor/services/")) {
        return "/service-categories";
    }

    if (!isEditorRoute(pathname)) {
        return pathname;
    }

    return "/site-settings";
};
