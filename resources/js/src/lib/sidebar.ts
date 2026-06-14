// Import Lucide icons
import {
    LayoutDashboard,
    Users,
    Settings,
    Trash2,
    ClipboardList,
    Building2,
    Image,
    Globe,
    Share2,
} from "lucide-react";

// Import interface
import { MenuItem } from "../types/sidebar";

export const sidebarMenu: MenuItem[] = [
    {
        title: "dashboard",
        icon: LayoutDashboard,
        path: "/dashboard",
        permissions: ["view dashboard"],
    },

    // Configuration Section
    {
        title: "configuration",
        isSection: true,
        permissions: ["view users", "manage settings", "view organizations"],
    },
    {
        title: "users",
        icon: Users,
        children: [{ title: "all_users", path: "/users" }],
        permissions: ["view users"],
    },
    {
        title: "settings",
        icon: Settings,
        path: "/settings",
        permissions: ["manage settings"],

    },

    // Website Content Section
    {
        title: "website_content",
        isSection: true,
        permissions: ["view media", "manage site settings", "view social links"],
    },
    {
        title: "site_settings",
        icon: Globe,
        path: "/site-settings",
        permissions: ["manage site settings"],
    },
    {
        title: "social_links",
        icon: Share2,
        path: "/social-links",
        permissions: ["view social links"],
    },
    {
        title: "media_library",
        icon: Image,
        path: "/media",
        permissions: ["view media"],
    },

    // System Monitoring Section
    {
        title: "system_monitoring",
        isSection: true,
        permissions: ["view logs", "view trash items"],
    },
    {
        title: "logs",
        icon: ClipboardList,
        path: "/logs",
        permissions: ["view logs"],
    },
    {
        title: "trash_items",
        icon: Trash2,
        path: "/trash",
        permissions: ["view trash items"],
    },
];

/**
 * Filter sidebar menu items based on user permissions
 * @param menuItems - Array of menu items to filter
 * @param hasAnyPermission - Function to check if user has any of the required permissions
 * @returns Filtered array of menu items
 */
export const filterMenuByPermissions = (
    menuItems: MenuItem[],
    hasAnyPermission: (permissions: string[]) => boolean
): MenuItem[] => {
    return menuItems
        .map((item) => {
            // If item has no permissions, show it
            if (!item.permissions || item.permissions.length === 0) {
                return item;
            }

            // Check if user has any of the required permissions
            if (!hasAnyPermission(item.permissions)) {
                return null;
            }

            // If item has children, filter them too
            if (item.children) {
                const filteredChildren = filterMenuByPermissions(
                    item.children,
                    hasAnyPermission
                );
                return {
                    ...item,
                    children: filteredChildren,
                };
            }

            return item;
        })
        .filter((item): item is MenuItem => item !== null);
};

/**
 * Clean up empty sections after permission filtering
 * @param menuItems - Array of menu items to clean
 * @returns Cleaned array of menu items
 */
export const cleanEmptySections = (menuItems: MenuItem[]): MenuItem[] => {
    const cleaned = menuItems.filter((item, index) => {
        // If it's a section, check if there are any non-section items after it
        if (item.isSection) {
            const nextNonSectionIndex = menuItems.findIndex(
                (nextItem, nextIndex) =>
                    nextIndex > index && !nextItem.isSection
            );

            // If there's no next non-section item, or if the next non-section item is after another section, remove this section
            if (nextNonSectionIndex === -1) {
                return false;
            }

            const nextSectionIndex = menuItems.findIndex(
                (nextItem, nextIndex) => nextIndex > index && nextItem.isSection
            );

            if (
                nextSectionIndex !== -1 &&
                nextSectionIndex < nextNonSectionIndex
            ) {
                return false;
            }
        }

        return true;
    });

    return cleaned;
};

/**
 * Example function to demonstrate permission filtering
 * This can be used for testing or documentation purposes
 * @param userPermissions - Array of permission names the user has
 * @returns Filtered sidebar menu for the user
 */
export const getFilteredMenuForUser = (
    userPermissions: string[]
): MenuItem[] => {
    const mockHasAnyPermission = (requiredPermissions: string[]): boolean => {
        return requiredPermissions.some((permission) =>
            userPermissions.includes(permission)
        );
    };

    return cleanEmptySections(
        filterMenuByPermissions(sidebarMenu, mockHasAnyPermission)
    );
};
