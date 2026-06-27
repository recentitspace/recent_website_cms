import {
    ArrowRight,
    Briefcase,
    Building2,
    DollarSign,
    Globe,
    Home,
    Layers,
    MessageCircle,
    Newspaper,
    Phone,
    Sparkles,
    UserCircle,
} from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

import Breadcrumb from "../../components/Breadcrumb";
import EditorPageShell from "./components/EditorPageShell";
import EditorTip from "./components/EditorTip";

const editorPages = [
    {
        title: "Site-wide settings",
        description: "Logo, contact details, social links, and your image library.",
        path: "/editor/site-wide",
        icon: Globe,
        color: "from-sky-500/10 to-sky-500/5",
    },
    {
        title: "Home page",
        description: "Hero banner, stats, client logos, testimonials, and section headings.",
        path: "/editor/home",
        icon: Home,
        color: "from-primary/15 to-primary/5",
    },
    {
        title: "About page",
        description: "Your story, values, objectives, and the about-page video.",
        path: "/editor/about",
        icon: UserCircle,
        color: "from-violet-500/10 to-violet-500/5",
    },
    {
        title: "Services",
        description: "Service group pages, individual services, and related FAQs.",
        path: "/editor/services/business-automation",
        icon: Layers,
        color: "from-amber-500/10 to-amber-500/5",
    },
    {
        title: "Pricing",
        description: "Pricing categories and the plans visitors can choose from.",
        path: "/editor/pricing",
        icon: DollarSign,
        color: "from-emerald-500/10 to-emerald-500/5",
    },
    {
        title: "Portfolio",
        description: "Project categories and case studies shown on your site.",
        path: "/editor/portfolio",
        icon: Briefcase,
        color: "from-rose-500/10 to-rose-500/5",
    },
    {
        title: "Blog",
        description: "Articles for your blog pages and the home page carousel.",
        path: "/editor/blog",
        icon: Newspaper,
        color: "from-indigo-500/10 to-indigo-500/5",
    },
    {
        title: "Clients page",
        description: "Company logos on the Our Trusted Clients page.",
        path: "/editor/clients",
        icon: Building2,
        color: "from-teal-500/10 to-teal-500/5",
    },
    {
        title: "FAQ page",
        description: "The FAQ page intro and general questions visitors see.",
        path: "/editor/faq",
        icon: MessageCircle,
        color: "from-cyan-500/10 to-cyan-500/5",
    },
    {
        title: "Contact page",
        description: "Contact page headline and intro text.",
        path: "/editor/contact",
        icon: Phone,
        color: "from-orange-500/10 to-orange-500/5",
    },
];

const EditorOverview = () => {
    return (
        <>
            <Breadcrumb
                items={[
                    { title: "Dashboard", path: "/dashboard" },
                    { title: "Website Editor" },
                ]}
            />

            <EditorPageShell
                title="Website Editor"
                subtitle="Pick a page below to update your website. Everything is grouped the same way visitors see it — no technical knowledge needed."
                icon={Sparkles}
            >
                <EditorTip>
                    <strong>How it works:</strong> choose a page, review what visitors currently
                    see, then click the blue <strong>Edit</strong> button on any section. Changes
                    are saved when you close the edit window. Switch to <strong>Advanced</strong> in
                    the top bar only if you need spreadsheet-style tables.
                </EditorTip>

                <div className="grid gap-4 md:grid-cols-2">
                    {editorPages.map((page) => (
                        <Link
                            key={page.path}
                            to={page.path}
                            className="group overflow-hidden rounded-2xl border border-white-dark/20 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md dark:border-white/10 dark:bg-black"
                        >
                            <div className={`bg-gradient-to-br ${page.color} p-5`}>
                                <div className="flex items-start justify-between gap-3">
                                    <div className="rounded-xl bg-white/80 p-3 text-primary shadow-sm dark:bg-black/50">
                                        <page.icon size={24} strokeWidth={1.75} />
                                    </div>
                                    <ArrowRight
                                        size={18}
                                        className="mt-1 text-gray-400 transition group-hover:translate-x-1 group-hover:text-primary"
                                    />
                                </div>
                            </div>
                            <div className="p-5 pt-4">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {page.title}
                                </h2>
                                <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                                    {page.description}
                                </p>
                                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                                    Open page
                                    <ArrowRight size={14} />
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </EditorPageShell>
        </>
    );
};

export default EditorOverview;
