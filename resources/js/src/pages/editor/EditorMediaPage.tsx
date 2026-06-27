import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Image } from "lucide-react";
import React, { useState } from "react";

import Breadcrumb from "../../components/Breadcrumb";
import MediaModal from "../media/components/MediaModal";
import { mediaApi } from "../../services/media";
import { IMedia } from "../../types";
import EditorEntityListSection from "./components/EditorEntityListSection";
import EditorPageShell from "./components/EditorPageShell";
import EditorTip from "./components/EditorTip";

const EditorMediaPage = () => {
    const queryClient = useQueryClient();
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState<IMedia | null>(null);

    const { data: mediaResponse, isLoading } = useQuery({
        queryKey: ["editor-media-library"],
        queryFn: () =>
            mediaApi.getAll({
                per_page: 100,
                sort_by: "created_at",
                sort_direction: "desc",
            }),
    });

    const refresh = () => {
        queryClient.invalidateQueries({ queryKey: ["editor-media-library"] });
        queryClient.invalidateQueries({ queryKey: ["Media Table"] });
    };

    return (
        <>
            <Breadcrumb
                items={[
                    { title: "Dashboard", path: "/dashboard" },
                    { title: "Website Editor", path: "/editor" },
                    { title: "Site-wide", path: "/editor/site-wide" },
                    { title: "Image library" },
                ]}
            />

            <EditorPageShell
                title="Image library"
                subtitle="Upload and manage photos used across your website."
                icon={Image}
                tip={
                    <>
                        Images you upload here can be picked when editing page sections, logos,
                        portfolios, and more.
                    </>
                }
            >
                <EditorEntityListSection
                    title="Your images"
                    description="Click a photo to update its description, or upload a new image."
                    items={mediaResponse?.data || []}
                    isLoading={isLoading}
                    emptyMessage="No images uploaded yet."
                    emptyHint="Select one or more JPEG, PNG, GIF, SVG, or WebP files up to 5MB each."
                    onAdd={() => {
                        setSelectedMedia(null);
                        setModalOpen(true);
                    }}
                    onEdit={(item) => {
                        setSelectedMedia(item);
                        setModalOpen(true);
                    }}
                    addLabel="Upload images"
                    editLabel="Edit image"
                    renderItem={(item) => (
                        <div className="flex items-center gap-3">
                            <img
                                src={item.url}
                                alt={item.alt_text || item.original_name}
                                className="h-16 w-16 shrink-0 rounded-lg border border-white-dark/20 bg-white object-cover dark:border-white/10"
                            />
                            <div className="min-w-0">
                                <p className="truncate font-medium text-gray-900 dark:text-white">
                                    {item.original_name}
                                </p>
                                {item.alt_text && (
                                    <p className="mt-1 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                                        {item.alt_text}
                                    </p>
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

            <MediaModal
                isOpen={modalOpen}
                setIsOpen={(open) => {
                    setModalOpen(open);
                    if (!open) {
                        setSelectedMedia(null);
                        refresh();
                    }
                }}
                mediaToEdit={selectedMedia}
            />
        </>
    );
};

export default EditorMediaPage;
