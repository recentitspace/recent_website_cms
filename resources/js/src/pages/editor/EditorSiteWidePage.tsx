import { ArrowRight, Globe, Image, Settings, Share2 } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

import Breadcrumb from "../../components/Breadcrumb";
import EditorPageShell from "./components/EditorPageShell";
import EditorTip from "./components/EditorTip";

const EditorSiteWidePage = () => {
    const links = [
        {
            title: "Company & contact info",
            description: "Your company name, logo, email, phone number, and office address.",
            path: "/site-settings",
            icon: Settings,
            color: "from-primary/15 to-primary/5",
        },
        {
            title: "Social media links",
            description: "Links to Facebook, Instagram, TikTok, LinkedIn, and other profiles.",
            path: "/editor/site-wide/social-links",
            icon: Share2,
            color: "from-sky-500/10 to-sky-500/5",
        },
        {
            title: "Image library",
            description: "Upload and manage photos used across your website.",
            path: "/editor/site-wide/media",
            icon: Image,
            color: "from-violet-500/10 to-violet-500/5",
        },
    ];

    return (
        <>
            <Breadcrumb
                items={[
                    { title: "Dashboard", path: "/dashboard" },
                    { title: "Website Editor", path: "/editor" },
                    { title: "Site-wide" },
                ]}
            />

            <EditorPageShell
                title="Site-wide settings"
                subtitle="Information and assets used across your whole website — set them once and they appear everywhere."
                icon={Globe}
                tip={
                    <>
                        Contact details you set here (phone, email, address) automatically appear on
                        the contact page and footer. You don&apos;t need to enter them twice.
                    </>
                }
            >
                <div className="grid gap-4 md:grid-cols-3">
                    {links.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className="group overflow-hidden rounded-2xl border border-white-dark/20 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md dark:border-white/10 dark:bg-black"
                        >
                            <div className={`bg-gradient-to-br ${link.color} p-4`}>
                                <div className="inline-flex rounded-xl bg-white/80 p-2.5 text-primary shadow-sm dark:bg-black/50">
                                    <link.icon size={20} />
                                </div>
                            </div>
                            <div className="p-4">
                                <h4 className="font-semibold text-gray-900 dark:text-white">
                                    {link.title}
                                </h4>
                                <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                                    {link.description}
                                </p>
                                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                                    Open
                                    <ArrowRight
                                        size={14}
                                        className="transition group-hover:translate-x-0.5"
                                    />
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>

                <EditorTip variant="info">
                    Company info opens as a simple form. Social links and images use the same
                    friendly card view. Use the sidebar to return to <strong>Website Editor</strong>{" "}
                    when you&apos;re done.
                </EditorTip>
            </EditorPageShell>
        </>
    );
};

export default EditorSiteWidePage;
