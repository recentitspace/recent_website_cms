import { CmsContentMode } from "../contexts/CmsContentModeContext";
import { MenuItem } from "../types/sidebar";
import { editorWebsiteMenu } from "./sidebarEditor";
import { sidebarMenu } from "./sidebar";

const WEBSITE_CONTENT_SECTION_TITLE = "website_content";
const SYSTEM_MONITORING_SECTION_TITLE = "system_monitoring";

const sliceWebsiteContentSection = (items: MenuItem[]): MenuItem[] => {
    const startIndex = items.findIndex(
        (item) => item.isSection && item.title === WEBSITE_CONTENT_SECTION_TITLE
    );
    const endIndex = items.findIndex(
        (item) => item.isSection && item.title === SYSTEM_MONITORING_SECTION_TITLE
    );

    if (startIndex === -1 || endIndex === -1) {
        return [];
    }

    return items.slice(startIndex, endIndex);
};

export const buildSidebarMenu = (mode: CmsContentMode): MenuItem[] => {
    const websiteContentStart = sidebarMenu.findIndex(
        (item) => item.isSection && item.title === WEBSITE_CONTENT_SECTION_TITLE
    );
    const systemMonitoringStart = sidebarMenu.findIndex(
        (item) => item.isSection && item.title === SYSTEM_MONITORING_SECTION_TITLE
    );

    if (websiteContentStart === -1 || systemMonitoringStart === -1) {
        return sidebarMenu;
    }

    const beforeWebsiteContent = sidebarMenu.slice(0, websiteContentStart);
    const afterWebsiteContent = sidebarMenu.slice(systemMonitoringStart);
    const websiteContentMenu =
        mode === "editor"
            ? editorWebsiteMenu
            : sliceWebsiteContentSection(sidebarMenu);

    return [...beforeWebsiteContent, ...websiteContentMenu, ...afterWebsiteContent];
};
