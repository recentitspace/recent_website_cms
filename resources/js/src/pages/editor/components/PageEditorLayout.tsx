import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FileText, Home, MessageCircle, Phone, UserCircle } from "lucide-react";
import React, { useMemo, useState } from "react";

import Breadcrumb from "../../../components/Breadcrumb";
import AboutDriveItemModal from "../../about-drive-item/components/Modal";
import AboutObjectiveModal from "../../about-objective/components/Modal";
import PageBlockModal from "../../page-block/components/PageBlockModal";
import WhyChooseItemModal from "../../why-choose-item/components/Modal";
import { aboutDriveItemApi } from "../../../services/aboutDriveItem";
import { aboutObjectiveApi } from "../../../services/aboutObjective";
import { pageBlockApi } from "../../../services/pageBlock";
import { whyChooseItemApi } from "../../../services/whyChooseItem";
import {
    IAboutDriveItem,
    IAboutObjective,
    IContentCardItem,
    IPageBlock,
    IWhyChooseItem,
    PageName,
} from "../../../types";
import { PAGE_EDITOR_TITLES, sortPageBlocksForEditor } from "../lib/editorPageLabels";
import EditorBlockCard from "./EditorBlockCard";
import EditorLoadingState from "./EditorLoadingState";
import EditorPageShell from "./EditorPageShell";

type ItemBlockKey = "home_why_choose" | "about_what_drives_us" | "about_objectives";

const BLOCKS_WITH_ITEMS = new Set<ItemBlockKey>([
    "home_why_choose",
    "about_what_drives_us",
    "about_objectives",
]);

const PAGE_ICONS: Partial<Record<PageName, typeof Home>> = {
    home: Home,
    about: UserCircle,
    faq: MessageCircle,
    contact: Phone,
};

interface ItemEditorState {
    blockKey: ItemBlockKey;
    whyChooseItem?: IWhyChooseItem | null;
    aboutDriveItem?: IAboutDriveItem | null;
    aboutObjective?: IAboutObjective | null;
}

interface PageEditorLayoutProps {
    page: PageName;
    children?: React.ReactNode;
}

const toContentCard = (item: {
    id: number;
    title: string;
    body?: string | null;
    bullets?: string[] | null;
}): IContentCardItem => ({
    id: item.id,
    title: item.title,
    body: item.body,
    bullets: item.bullets,
});

const PageEditorLayout: React.FC<PageEditorLayoutProps> = ({ page, children }) => {
    const queryClient = useQueryClient();
    const meta = PAGE_EDITOR_TITLES[page];
    const PageIcon = PAGE_ICONS[page] || FileText;

    const [blockModalOpen, setBlockModalOpen] = useState(false);
    const [itemEditor, setItemEditor] = useState<ItemEditorState | null>(null);
    const [selectedBlock, setSelectedBlock] = useState<IPageBlock | null>(null);

    const { data: blocksResponse, isLoading } = useQuery({
        queryKey: ["editor-page-blocks", page],
        queryFn: () =>
            pageBlockApi.getAll({
                per_page: 100,
                sort_by: "key",
                sort_direction: "asc",
                filter: { page },
            }),
    });

    const { data: whyChooseResponse } = useQuery({
        queryKey: ["editor-why-choose-items"],
        queryFn: () =>
            whyChooseItemApi.getAll({
                per_page: 100,
                sort_by: "sort_order",
                sort_direction: "asc",
            }),
        enabled: page === "home",
    });

    const { data: aboutDriveResponse } = useQuery({
        queryKey: ["editor-about-drive-items"],
        queryFn: () =>
            aboutDriveItemApi.getAll({
                per_page: 100,
                sort_by: "sort_order",
                sort_direction: "asc",
            }),
        enabled: page === "about",
    });

    const { data: aboutObjectivesResponse } = useQuery({
        queryKey: ["editor-about-objectives"],
        queryFn: () =>
            aboutObjectiveApi.getAll({
                per_page: 100,
                sort_by: "sort_order",
                sort_direction: "asc",
            }),
        enabled: page === "about",
    });

    const blocks = useMemo(
        () => sortPageBlocksForEditor(page, blocksResponse?.data || []),
        [page, blocksResponse?.data]
    );

    const itemsByBlockKey = useMemo(() => {
        const map = new Map<string, IContentCardItem[]>();

        if (page === "home") {
            map.set(
                "home_why_choose",
                (whyChooseResponse?.data || []).map(toContentCard)
            );
        }

        if (page === "about") {
            map.set(
                "about_what_drives_us",
                (aboutDriveResponse?.data || []).map(toContentCard)
            );
            map.set(
                "about_objectives",
                (aboutObjectivesResponse?.data || []).map(toContentCard)
            );
        }

        return map;
    }, [page, whyChooseResponse, aboutDriveResponse, aboutObjectivesResponse]);

    const refresh = () => {
        queryClient.invalidateQueries({ queryKey: ["editor-page-blocks", page] });
        queryClient.invalidateQueries({ queryKey: ["editor-why-choose-items"] });
        queryClient.invalidateQueries({ queryKey: ["editor-about-drive-items"] });
        queryClient.invalidateQueries({ queryKey: ["editor-about-objectives"] });
    };

    const closeItemEditor = () => {
        setItemEditor(null);
        refresh();
    };

    const openEditBlock = (block: IPageBlock) => {
        setSelectedBlock(block);
        setBlockModalOpen(true);
    };

    const openEditItem = (blockKey: ItemBlockKey, item: IContentCardItem) => {
        if (blockKey === "home_why_choose") {
            const full = whyChooseResponse?.data?.find((row) => row.id === item.id);
            setItemEditor({ blockKey, whyChooseItem: full || null });
            return;
        }

        if (blockKey === "about_what_drives_us") {
            const full = aboutDriveResponse?.data?.find((row) => row.id === item.id);
            setItemEditor({ blockKey, aboutDriveItem: full || null });
            return;
        }

        const full = aboutObjectivesResponse?.data?.find((row) => row.id === item.id);
        setItemEditor({ blockKey, aboutObjective: full || null });
    };

    const openAddItem = (blockKey: ItemBlockKey) => {
        if (blockKey === "home_why_choose") {
            setItemEditor({ blockKey, whyChooseItem: null });
            return;
        }

        if (blockKey === "about_what_drives_us") {
            setItemEditor({ blockKey, aboutDriveItem: null });
            return;
        }

        setItemEditor({ blockKey, aboutObjective: null });
    };

    return (
        <>
            <Breadcrumb
                items={[
                    { title: "Dashboard", path: "/dashboard" },
                    { title: "Website Editor", path: "/editor" },
                    { title: meta.title },
                ]}
            />

            <EditorPageShell
                title={meta.title}
                subtitle={meta.subtitle}
                icon={PageIcon}
                tip={
                    <>
                        Each section is a fixed part of this page — edit its text, images, or
                        buttons here. Card lists below a section are managed separately and keep
                        their own display order.
                    </>
                }
            >
                {isLoading ? (
                    <EditorLoadingState message="Loading page sections..." />
                ) : (
                    blocks.map((block) => {
                        const hasItems = BLOCKS_WITH_ITEMS.has(block.key as ItemBlockKey);
                        const blockKey = block.key as ItemBlockKey;

                        return (
                            <EditorBlockCard
                                key={block.id}
                                block={block}
                                items={hasItems ? itemsByBlockKey.get(block.key) || [] : []}
                                onEditBlock={openEditBlock}
                                onEditItem={
                                    hasItems
                                        ? (item) => openEditItem(blockKey, item)
                                        : undefined
                                }
                                onAddItem={hasItems ? () => openAddItem(blockKey) : undefined}
                            />
                        );
                    })
                )}

                {children}
            </EditorPageShell>

            <PageBlockModal
                isOpen={blockModalOpen}
                setIsOpen={(open) => {
                    setBlockModalOpen(open);
                    if (!open) {
                        setSelectedBlock(null);
                        refresh();
                    }
                }}
                blockToEdit={selectedBlock}
            />

            <WhyChooseItemModal
                isOpen={itemEditor?.blockKey === "home_why_choose"}
                setIsOpen={(open) => {
                    if (!open) {
                        closeItemEditor();
                    }
                }}
                itemToEdit={itemEditor?.whyChooseItem}
            />

            <AboutDriveItemModal
                isOpen={itemEditor?.blockKey === "about_what_drives_us"}
                setIsOpen={(open) => {
                    if (!open) {
                        closeItemEditor();
                    }
                }}
                itemToEdit={itemEditor?.aboutDriveItem}
            />

            <AboutObjectiveModal
                isOpen={itemEditor?.blockKey === "about_objectives"}
                setIsOpen={(open) => {
                    if (!open) {
                        closeItemEditor();
                    }
                }}
                objectiveToEdit={itemEditor?.aboutObjective}
            />
        </>
    );
};

export default PageEditorLayout;
