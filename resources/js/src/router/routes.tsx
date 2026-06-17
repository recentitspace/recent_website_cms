import React from "react";
import { lazy } from "react";
import { Navigate } from "react-router-dom";

// Dashboard
const Dashboard = lazy(() => import("../pages/dashboard"));

// Not Found
const NotFound = lazy(() => import("../pages/404"));

// Authentication
const Login = lazy(() => import("../pages/login"));
const Profile = lazy(() => import("../pages/profile"));

// Error pages
const Unauthorized = lazy(() => import("../components/errors/Unauthorized"));

// User (Configuration)
const User = lazy(() => import("../pages/user"));

// Settings (Configuration)
const Settings = lazy(() => import("../pages/settings"));
const SettingsMail = lazy(() => import("../pages/settings/mail"));
const SettingsRoles = lazy(() => import("../pages/settings/roles"));

// Organization (Configuration)
const Organization = lazy(() => import("../pages/organization"));

// Logs (System Monitoring)
const Logs = lazy(() => import("../pages/logs"));
const LockScreen = lazy(() => import("../pages/lock-screen"));

// Website Content
const Media = lazy(() => import("../pages/media"));
const SiteSettings = lazy(() => import("../pages/site-settings"));
const SocialLinks = lazy(() => import("../pages/social-link"));
const PortfolioCategories = lazy(() => import("../pages/portfolio-category"));
const PortfolioItems = lazy(() => import("../pages/portfolio-item"));
const Clients = lazy(() => import("../pages/client"));
const Testimonials = lazy(() => import("../pages/testimonial"));

// Trash Management (System Monitoring)
const TrashPage = lazy(() => import("../pages/trash"));
const TrashUsers = lazy(() => import("../pages/trash/Users"));
const TrashRoles = lazy(() => import("../pages/trash/Roles"));
const TrashPortfolioCategories = lazy(() => import("../pages/trash/PortfolioCategories"));
const TrashPortfolioItems = lazy(() => import("../pages/trash/PortfolioItems"));
const TrashClients = lazy(() => import("../pages/trash/Clients"));
const TrashTestimonials = lazy(() => import("../pages/trash/Testimonials"));

// Redirect component - now redirects from root (/) to /dashboard
const RedirectToDashboard = () => <Navigate to="/dashboard" replace />;

// Define route types
export type RouteConfig = {
    path: string;
    element: React.ReactNode;
    layout: "default" | "blank";
    errorElement?: React.ReactNode;
    isPublic?: boolean;
    children?: RouteConfig[];
    permissions?: string[];
};

// Public routes - accessible without authentication
export const publicRoutes: RouteConfig[] = [
    // auth
    {
        path: "/auth/login",
        element: <Login />,
        layout: "blank",
        isPublic: true,
    },
    {
        path: "/auth/lock-screen",
        element: <LockScreen />,
        layout: "blank",
        isPublic: true,
    },
];

// Protected routes - require authentication
export const protectedRoutes: RouteConfig[] = [
    // Redirect from root to dashboard
    {
        path: "/",
        element: <RedirectToDashboard />,
        layout: "default",
        permissions: ["view dashboard"],
    },

    // Dashboard at /dashboard path
    {
        path: "/dashboard",
        element: <Dashboard />,
        layout: "default",
        permissions: ["view dashboard"],
    },

    // CONFIGURATION SECTION
    // Users
    {
        path: "/users",
        element: <User />,
        layout: "default",
        permissions: ["view users"],
    },

    // WEBSITE CONTENT SECTION
    {
        path: "/site-settings",
        element: <SiteSettings />,
        layout: "default",
        permissions: ["manage site settings"],
    },
    {
        path: "/social-links",
        element: <SocialLinks />,
        layout: "default",
        permissions: ["view social links"],
    },
    {
        path: "/media",
        element: <Media />,
        layout: "default",
        permissions: ["view media"],
    },
    {
        path: "/portfolio-categories",
        element: <PortfolioCategories />,
        layout: "default",
        permissions: ["view portfolio categories"],
    },
    {
        path: "/portfolio-items",
        element: <PortfolioItems />,
        layout: "default",
        permissions: ["view portfolio items"],
    },
    {
        path: "/clients",
        element: <Clients />,
        layout: "default",
        permissions: ["view clients"],
    },
    {
        path: "/testimonials",
        element: <Testimonials />,
        layout: "default",
        permissions: ["view testimonials"],
    },
    {
        path: "/case-studies",
        element: <Navigate to="/portfolio-items" replace />,
        layout: "default",
    },

    // Settings (with nested tabs)
    {
        path: "/settings",
        element: <Settings />,
        layout: "default",
        permissions: ["manage settings"],
        children: [
            {
                path: "mail",
                element: <SettingsMail />,
                layout: "default",
                permissions: ["manage settings"],
            },
            {
                path: "roles",
                element: <SettingsRoles />,
                layout: "default",
                permissions: ["manage settings"],
            },
            {
                path: "organization",
                element: <Organization />,
                layout: "default",
                permissions: ["view organizations"],
            },
        ],
    },

    // SYSTEM MONITORING SECTION
    // Logs
    {
        path: "/logs",
        element: <Logs />,
        layout: "default",
        permissions: ["view logs"],
    },

    // Trash Items (with nested tabs)
    {
        path: "/trash",
        element: <TrashPage />,
        layout: "default",
        permissions: ["view trash items"],
        children: [
            {
                path: "users",
                element: <TrashUsers />,
                layout: "default",
                permissions: ["view trash items"],
            },
            {
                path: "roles",
                element: <TrashRoles />,
                layout: "default",
                permissions: ["view trash items"],
            },
            {
                path: "portfolio-categories",
                element: <TrashPortfolioCategories />,
                layout: "default",
                permissions: ["view trash items"],
            },
            {
                path: "portfolio-items",
                element: <TrashPortfolioItems />,
                layout: "default",
                permissions: ["view trash items"],
            },
            {
                path: "clients",
                element: <TrashClients />,
                layout: "default",
                permissions: ["view trash items"],
            },
            {
                path: "testimonials",
                element: <TrashTestimonials />,
                layout: "default",
                permissions: ["view trash items"],
            },
        ],
    },

    // Unauthorized access page
    {
        path: "/unauthorized",
        element: <Unauthorized />,
        layout: "blank",
    },

    // Profile page
    {
        path: "/auth/profile",
        element: <Profile />,
        layout: "default",
        permissions: [], // No special permissions, just authenticated
    },

    // apply 404
    {
        path: "*",
        element: <NotFound />,
        layout: "blank",
    },
];

// Combine all routes
export const routes: RouteConfig[] = [...publicRoutes, ...protectedRoutes];
