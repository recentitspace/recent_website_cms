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
const PricingSections = lazy(() => import("../pages/pricing-section"));
const PricingPlans = lazy(() => import("../pages/pricing-plan"));
const DomainExtensions = lazy(() => import("../pages/domain-extension"));
const ServiceCategories = lazy(() => import("../pages/service-category"));
const ServiceItems = lazy(() => import("../pages/service-item"));
const Faqs = lazy(() => import("../pages/faq"));
const StatCounters = lazy(() => import("../pages/stat-counter"));
const PageBlocks = lazy(() => import("../pages/page-block"));
const WhyChooseItems = lazy(() => import("../pages/why-choose-item"));
const AboutDriveItems = lazy(() => import("../pages/about-drive-item"));
const AboutObjectives = lazy(() => import("../pages/about-objective"));
const Blogs = lazy(() => import("../pages/blog"));

// Website Editor
const EditorOverview = lazy(() => import("../pages/editor"));
const EditorSiteWidePage = lazy(() => import("../pages/editor/EditorSiteWidePage"));
const EditorSocialLinksPage = lazy(() => import("../pages/editor/EditorSocialLinksPage"));
const EditorMediaPage = lazy(() => import("../pages/editor/EditorMediaPage"));
const EditorHomePage = lazy(() => import("../pages/editor/EditorHomePage"));
const EditorAboutPage = lazy(() => import("../pages/editor/EditorAboutPage"));
const EditorFaqPage = lazy(() => import("../pages/editor/EditorFaqPage"));
const EditorContactPage = lazy(() => import("../pages/editor/EditorContactPage"));
const EditorClientsPage = lazy(() => import("../pages/editor/EditorClientsPage"));
const EditorPricingPage = lazy(() => import("../pages/editor/EditorPricingPage"));
const EditorPricingPageContent = lazy(() => import("../pages/editor/EditorPricingPageContent"));
const EditorPortfolioPage = lazy(() => import("../pages/editor/EditorPortfolioPage"));
const EditorBlogsPage = lazy(() => import("../pages/editor/EditorBlogsPage"));
const ServiceCategoryEditorPage = lazy(
    () => import("../pages/editor/services/ServiceCategoryEditorPage")
);

// Trash Management (System Monitoring)
const TrashPage = lazy(() => import("../pages/trash"));
const TrashUsers = lazy(() => import("../pages/trash/Users"));
const TrashRoles = lazy(() => import("../pages/trash/Roles"));
const TrashPortfolioCategories = lazy(() => import("../pages/trash/PortfolioCategories"));
const TrashPortfolioItems = lazy(() => import("../pages/trash/PortfolioItems"));
const TrashClients = lazy(() => import("../pages/trash/Clients"));
const TrashTestimonials = lazy(() => import("../pages/trash/Testimonials"));
const TrashPricingSections = lazy(() => import("../pages/trash/PricingSections"));
const TrashPricingPlans = lazy(() => import("../pages/trash/PricingPlans"));
const TrashDomainExtensions = lazy(() => import("../pages/trash/DomainExtensions"));
const TrashServiceCategories = lazy(() => import("../pages/trash/ServiceCategories"));
const TrashServiceItems = lazy(() => import("../pages/trash/ServiceItems"));
const TrashFaqs = lazy(() => import("../pages/trash/Faqs"));
const TrashStatCounters = lazy(() => import("../pages/trash/StatCounters"));
const TrashPageBlocks = lazy(() => import("../pages/trash/PageBlocks"));
const TrashWhyChooseItems = lazy(() => import("../pages/trash/WhyChooseItems"));
const TrashAboutDriveItems = lazy(() => import("../pages/trash/AboutDriveItems"));
const TrashAboutObjectives = lazy(() => import("../pages/trash/AboutObjectives"));
const TrashBlogs = lazy(() => import("../pages/trash/Blogs"));

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
        path: "/pricing-sections",
        element: <PricingSections />,
        layout: "default",
        permissions: ["view pricing sections"],
    },
    {
        path: "/pricing-plans",
        element: <PricingPlans />,
        layout: "default",
        permissions: ["view pricing plans"],
    },
    {
        path: "/domain-extensions",
        element: <DomainExtensions />,
        layout: "default",
        permissions: ["view domain extensions"],
    },
    {
        path: "/service-categories",
        element: <ServiceCategories />,
        layout: "default",
        permissions: ["view service categories"],
    },
    {
        path: "/service-items",
        element: <ServiceItems />,
        layout: "default",
        permissions: ["view service items"],
    },
    {
        path: "/faqs",
        element: <Faqs />,
        layout: "default",
        permissions: ["view faqs"],
    },
    {
        path: "/stat-counters",
        element: <StatCounters />,
        layout: "default",
        permissions: ["view stat counters"],
    },
    {
        path: "/page-blocks",
        element: <PageBlocks />,
        layout: "default",
        permissions: ["view page blocks"],
    },
    {
        path: "/why-choose-items",
        element: <WhyChooseItems />,
        layout: "default",
        permissions: ["view why choose items"],
    },
    {
        path: "/about-drive-items",
        element: <AboutDriveItems />,
        layout: "default",
        permissions: ["view about drive items"],
    },
    {
        path: "/about-objectives",
        element: <AboutObjectives />,
        layout: "default",
        permissions: ["view about objectives"],
    },
    {
        path: "/blogs",
        element: <Blogs />,
        layout: "default",
        permissions: ["view blogs"],
    },
    {
        path: "/case-studies",
        element: <Navigate to="/portfolio-items" replace />,
        layout: "default",
    },

    // WEBSITE EDITOR
    {
        path: "/editor",
        element: <EditorOverview />,
        layout: "default",
        permissions: ["view page blocks"],
    },
    {
        path: "/editor/site-wide",
        element: <EditorSiteWidePage />,
        layout: "default",
        permissions: ["manage site settings", "view social links", "view media"],
    },
    {
        path: "/editor/site-wide/social-links",
        element: <EditorSocialLinksPage />,
        layout: "default",
        permissions: ["view social links"],
    },
    {
        path: "/editor/site-wide/media",
        element: <EditorMediaPage />,
        layout: "default",
        permissions: ["view media"],
    },
    {
        path: "/editor/home",
        element: <EditorHomePage />,
        layout: "default",
        permissions: ["view page blocks", "view stat counters", "view clients", "view testimonials"],
    },
    {
        path: "/editor/about",
        element: <EditorAboutPage />,
        layout: "default",
        permissions: ["view page blocks"],
    },
    {
        path: "/editor/services/:slug",
        element: <ServiceCategoryEditorPage />,
        layout: "default",
        permissions: ["view service categories", "view service items", "view faqs"],
    },
    {
        path: "/editor/pricing",
        element: <EditorPricingPage />,
        layout: "default",
        permissions: ["view pricing sections", "view pricing plans"],
    },
    {
        path: "/editor/pricing/page",
        element: <EditorPricingPageContent />,
        layout: "default",
        permissions: ["view page blocks"],
    },
    {
        path: "/editor/portfolio",
        element: <EditorPortfolioPage />,
        layout: "default",
        permissions: ["view portfolio categories", "view portfolio items"],
    },
    {
        path: "/editor/blog",
        element: <EditorBlogsPage />,
        layout: "default",
        permissions: ["view blogs"],
    },
    {
        path: "/editor/faq",
        element: <EditorFaqPage />,
        layout: "default",
        permissions: ["view faqs", "view page blocks"],
    },
    {
        path: "/editor/contact",
        element: <EditorContactPage />,
        layout: "default",
        permissions: ["view page blocks", "manage site settings"],
    },
    {
        path: "/editor/clients",
        element: <EditorClientsPage />,
        layout: "default",
        permissions: ["view clients"],
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
            {
                path: "pricing-sections",
                element: <TrashPricingSections />,
                layout: "default",
                permissions: ["view trash items"],
            },
            {
                path: "pricing-plans",
                element: <TrashPricingPlans />,
                layout: "default",
                permissions: ["view trash items"],
            },
            {
                path: "domain-extensions",
                element: <TrashDomainExtensions />,
                layout: "default",
                permissions: ["view trash items"],
            },
            {
                path: "service-categories",
                element: <TrashServiceCategories />,
                layout: "default",
                permissions: ["view trash items"],
            },
            {
                path: "service-items",
                element: <TrashServiceItems />,
                layout: "default",
                permissions: ["view trash items"],
            },
            {
                path: "faqs",
                element: <TrashFaqs />,
                layout: "default",
                permissions: ["view trash items"],
            },
            {
                path: "stat-counters",
                element: <TrashStatCounters />,
                layout: "default",
                permissions: ["view trash items"],
            },
            {
                path: "page-blocks",
                element: <TrashPageBlocks />,
                layout: "default",
                permissions: ["view trash items"],
            },
            {
                path: "why-choose-items",
                element: <TrashWhyChooseItems />,
                layout: "default",
                permissions: ["view trash items"],
            },
            {
                path: "about-drive-items",
                element: <TrashAboutDriveItems />,
                layout: "default",
                permissions: ["view trash items"],
            },
            {
                path: "about-objectives",
                element: <TrashAboutObjectives />,
                layout: "default",
                permissions: ["view trash items"],
            },
            {
                path: "blogs",
                element: <TrashBlogs />,
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
