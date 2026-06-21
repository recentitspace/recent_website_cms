import {
    Trash2,
    Users,
    Shield,
    FolderTree,
    Briefcase,
    Handshake,
    MessageSquareQuote,
    DollarSign,
    Layers,
    HelpCircle,
    FileText,
} from "lucide-react";
import React, { Suspense } from "react";
import { useLocation, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Breadcrumb from "../../components/Breadcrumb";
import MobileToggle from "./components/MobileToggle";
import Sidebar from "./components/Sidebar";
import Loader from "../../components/Loader";

const TrashIndex: React.FC = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();

    const trashItems = [
        {
            id: "users",
            title: t("trashed_users"),
            icon: <Users className="w-5 h-5" />,
            path: "/trash/users",
        },
        {
            id: "roles",
            title: t("trashed_roles"),
            icon: <Shield className="w-5 h-5" />,
            path: "/trash/roles",
        },
        {
            id: "portfolio-categories",
            title: t("trashed_portfolio_categories"),
            icon: <FolderTree className="w-5 h-5" />,
            path: "/trash/portfolio-categories",
        },
        {
            id: "portfolio-items",
            title: t("trashed_portfolio_items"),
            icon: <Briefcase className="w-5 h-5" />,
            path: "/trash/portfolio-items",
        },
        {
            id: "clients",
            title: t("trashed_clients"),
            icon: <Handshake className="w-5 h-5" />,
            path: "/trash/clients",
        },
        {
            id: "testimonials",
            title: t("trashed_testimonials"),
            icon: <MessageSquareQuote className="w-5 h-5" />,
            path: "/trash/testimonials",
        },
        {
            id: "pricing-sections",
            title: t("trashed_pricing_sections"),
            icon: <DollarSign className="w-5 h-5" />,
            path: "/trash/pricing-sections",
        },
        {
            id: "pricing-plans",
            title: t("trashed_pricing_plans"),
            icon: <DollarSign className="w-5 h-5" />,
            path: "/trash/pricing-plans",
        },
        {
            id: "domain-extensions",
            title: t("trashed_domain_extensions"),
            icon: <DollarSign className="w-5 h-5" />,
            path: "/trash/domain-extensions",
        },
        {
            id: "service-categories",
            title: t("trashed_service_categories"),
            icon: <Layers className="w-5 h-5" />,
            path: "/trash/service-categories",
        },
        {
            id: "service-items",
            title: t("trashed_service_items"),
            icon: <Layers className="w-5 h-5" />,
            path: "/trash/service-items",
        },
        {
            id: "faqs",
            title: t("trashed_faqs"),
            icon: <HelpCircle className="w-5 h-5" />,
            path: "/trash/faqs",
        },
        {
            id: "stat-counters",
            title: t("trashed_stat_counters"),
            icon: <FileText className="w-5 h-5" />,
            path: "/trash/stat-counters",
        },
        {
            id: "page-blocks",
            title: t("trashed_page_blocks"),
            icon: <FileText className="w-5 h-5" />,
            path: "/trash/page-blocks",
        },
        {
            id: "why-choose-items",
            title: t("trashed_why_choose_items"),
            icon: <FileText className="w-5 h-5" />,
            path: "/trash/why-choose-items",
        },
        {
            id: "about-drive-items",
            title: t("trashed_about_drive_items"),
            icon: <FileText className="w-5 h-5" />,
            path: "/trash/about-drive-items",
        },
        {
            id: "about-objectives",
            title: t("trashed_about_objectives"),
            icon: <FileText className="w-5 h-5" />,
            path: "/trash/about-objectives",
        },
    ];

    const breadcrumbItems = [
        { title: "Dashboard", path: "/" },
        { title: t("trash_items") },
    ];

    // Determine active tab from the current route
    const activeTab = trashItems.find(item => location.pathname.startsWith(item.path))?.id || trashItems[0].id;
    const [showMobileMenu, setShowMobileMenu] = React.useState(false);
    const activeTitle = trashItems.find(item => item.id === activeTab)?.title || '';

    // Redirect to default tab if at /trash
    React.useEffect(() => {
        if (location.pathname === "/trash" || location.pathname === "/trash/") {
            navigate(trashItems[0].path, { replace: true });
        }
    }, [location.pathname, navigate, trashItems]);

    return (
        <div>
            <Breadcrumb items={breadcrumbItems} />
            <div className="mt-5">
                <div className="panel">
                    <div className="mb-6">
                        <h5 className="font-semibold text-xl dark:text-white-light flex items-center">
                            <Trash2 className="inline-block mr-2 w-6 h-6" />
                            {t("trash_items")}
                        </h5>
                    </div>
                    <MobileToggle
                        activeTitle={activeTitle}
                        showMobileMenu={showMobileMenu}
                        setShowMobileMenu={setShowMobileMenu}
                    />
                    <div className="flex flex-col md:flex-row h-[60vh] md:h-[70vh]">
                        {/* Sidebar */}
                        <Sidebar
                            items={trashItems}
                            activeTab={activeTab}
                            showMobileMenu={showMobileMenu}
                            linkComponent={NavLink}
                        />
                        {/* Content area */}
                        <main className="flex-1 min-w-0 h-full flex flex-col">
                            <Suspense fallback={<Loader />}>
                                <Outlet />
                            </Suspense>
                        </main>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrashIndex;
