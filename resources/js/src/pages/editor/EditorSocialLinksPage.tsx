import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Share2 } from "lucide-react";
import React, { useState } from "react";

import Breadcrumb from "../../components/Breadcrumb";
import SocialPlatformIcon, {
    getSocialPlatformLabel,
} from "../../components/social/SocialPlatformIcon";
import SocialLinkModal from "../social-link/components/SocialLinkModal";
import { socialLinkApi } from "../../services/socialLink";
import { ISocialLink } from "../../types";
import EditorEntityListSection from "./components/EditorEntityListSection";
import EditorPageShell from "./components/EditorPageShell";
import EditorTip from "./components/EditorTip";

const EditorSocialLinksPage = () => {
    const queryClient = useQueryClient();
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedLink, setSelectedLink] = useState<ISocialLink | null>(null);

    const { data: linksResponse, isLoading } = useQuery({
        queryKey: ["editor-social-links"],
        queryFn: () =>
            socialLinkApi.getAll({
                per_page: 100,
                sort_by: "sort_order",
                sort_direction: "asc",
            }),
    });

    const refresh = () => {
        queryClient.invalidateQueries({ queryKey: ["editor-social-links"] });
        queryClient.invalidateQueries({ queryKey: ["Social Link Table"] });
    };

    return (
        <>
            <Breadcrumb
                items={[
                    { title: "Dashboard", path: "/dashboard" },
                    { title: "Website Editor", path: "/editor" },
                    { title: "Site-wide", path: "/editor/site-wide" },
                    { title: "Social media links" },
                ]}
            />

            <EditorPageShell
                title="Social media links"
                subtitle="Add links to your Facebook, Instagram, TikTok, LinkedIn, and other profiles."
                icon={Share2}
                tip={
                    <>
                        These links appear in your website footer and anywhere visitors can follow
                        you online. Only active links are shown on the site.
                    </>
                }
            >
                <EditorEntityListSection
                    title="Your social profiles"
                    description="One card per platform — pick the network and paste the full profile URL."
                    items={linksResponse?.data || []}
                    isLoading={isLoading}
                    emptyMessage="No social links added yet."
                    emptyHint="Start with the platforms you use most, like Facebook or Instagram."
                    onAdd={() => {
                        setSelectedLink(null);
                        setModalOpen(true);
                    }}
                    onEdit={(link) => {
                        setSelectedLink(link);
                        setModalOpen(true);
                    }}
                    addLabel="Add social link"
                    editLabel="Edit link"
                    renderItem={(link) => (
                        <div className="flex items-start gap-3">
                            <SocialPlatformIcon platform={link.platform} />
                            <div className="min-w-0 flex-1">
                                <p className="font-semibold text-gray-900 dark:text-white">
                                    {getSocialPlatformLabel(link.platform)}
                                </p>
                                <p className="mt-1 truncate text-sm text-primary">{link.url}</p>
                                {!link.is_active && (
                                    <p className="mt-1 text-xs text-danger">Hidden on website</p>
                                )}
                            </div>
                        </div>
                    )}
                />

                <EditorTip variant="info">
                    When you&apos;re done, use the sidebar to return to{" "}
                    <strong>Website Editor</strong>.
                </EditorTip>
            </EditorPageShell>

            <SocialLinkModal
                isOpen={modalOpen}
                setIsOpen={(open) => {
                    setModalOpen(open);
                    if (!open) {
                        setSelectedLink(null);
                        refresh();
                    }
                }}
                socialLinkToEdit={selectedLink}
            />
        </>
    );
};

export default EditorSocialLinksPage;
