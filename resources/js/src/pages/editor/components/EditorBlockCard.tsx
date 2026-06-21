import { ImageIcon, Layers } from "lucide-react";
import React from "react";

import { IContentCardItem, IPageBlock } from "../../../types";
import { getPageBlockLabel } from "../lib/editorPageLabels";
import EditorActionButton from "./EditorActionButton";
import EditorEmptyState from "./EditorEmptyState";
import EditorPreviewField from "./EditorPreviewField";
import EditorSection from "./EditorSection";

interface EditorBlockCardProps {
    block: IPageBlock;
    items?: IContentCardItem[];
    sectionNumber?: number;
    onEditBlock: (block: IPageBlock) => void;
    onEditItem?: (item: IContentCardItem) => void;
    onAddItem?: () => void;
}

const isHeroBlock = (key: string) => key.includes("hero");

const EditorBlockCard: React.FC<EditorBlockCardProps> = ({
    block,
    items = [],
    sectionNumber,
    onEditBlock,
    onEditItem,
    onAddItem,
}) => {
    const label = getPageBlockLabel(block.key);
    const hero = isHeroBlock(block.key);

    return (
        <EditorSection
            title={label.title}
            description={label.description}
            sectionNumber={sectionNumber}
            badge={hero ? "Top of page" : undefined}
            action={
                <EditorActionButton
                    label="Edit this section"
                    onClick={() => onEditBlock(block)}
                    variant="primary"
                />
            }
        >
            <div
                className={`overflow-hidden rounded-xl border ${
                    hero
                        ? "border-primary/20 bg-gradient-to-br from-primary/5 via-white to-white dark:from-primary/10 dark:via-black dark:to-black"
                        : "border-white-dark/20 bg-white-light/20 dark:border-white/10 dark:bg-white/5"
                }`}
            >
                {block.image?.url ? (
                    <div className="relative">
                        <img
                            src={block.image.url}
                            alt={block.title || label.title}
                            className={`w-full object-cover ${hero ? "max-h-48" : "max-h-36"}`}
                        />
                        <span className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-1 text-xs text-white">
                            Section image
                        </span>
                    </div>
                ) : hero ? (
                    <div className="flex items-center gap-2 border-b border-white-dark/15 px-5 py-3 text-sm text-gray-500 dark:border-white/10">
                        <ImageIcon size={14} />
                        No image uploaded yet
                    </div>
                ) : null}

                <div className="space-y-4 p-5">
                    {block.title && (
                        <EditorPreviewField label="Headline">
                            <span className="whitespace-pre-wrap">{block.title}</span>
                        </EditorPreviewField>
                    )}
                    {block.subtitle && (
                        <EditorPreviewField label="Subheading" muted>
                            {block.subtitle}
                        </EditorPreviewField>
                    )}
                    {block.body && (
                        <EditorPreviewField label="Main text" muted>
                            <span className="whitespace-pre-wrap leading-relaxed">{block.body}</span>
                        </EditorPreviewField>
                    )}
                    {block.video_url && (
                        <EditorPreviewField label="Video link" muted>
                            {block.video_url}
                        </EditorPreviewField>
                    )}
                    {(block.cta_text || block.cta_secondary_text) && (
                        <EditorPreviewField label="Buttons on this section" muted>
                            <div className="flex flex-wrap gap-2 pt-1">
                                {block.cta_text && (
                                    <span className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-white">
                                        {block.cta_text}
                                    </span>
                                )}
                                {block.cta_secondary_text && (
                                    <span className="rounded-lg border border-primary/30 px-3 py-1.5 text-sm font-medium text-primary">
                                        {block.cta_secondary_text}
                                    </span>
                                )}
                            </div>
                        </EditorPreviewField>
                    )}

                    {!block.title &&
                        !block.subtitle &&
                        !block.body &&
                        !block.image?.url &&
                        !block.video_url && (
                            <p className="text-sm italic text-gray-500">
                                This section is empty. Click &ldquo;Edit this section&rdquo; to add
                                content.
                            </p>
                        )}
                </div>
            </div>

            {onAddItem && (
                <div className="mt-5 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                            <Layers size={16} className="text-primary" />
                            {items.length > 0
                                ? `Cards in this section (${items.length})`
                                : "Cards in this section"}
                        </div>
                        <EditorActionButton label="Add card" onClick={onAddItem} />
                    </div>

                    {items.length === 0 ? (
                        <EditorEmptyState
                            message="No cards yet."
                            hint="Add feature cards, objectives, or other items for this section."
                            onAction={onAddItem}
                            actionLabel="Add card"
                        />
                    ) : (
                        <div className="grid gap-3 md:grid-cols-2">
                            {items.map((item, index) => (
                                <div
                                    key={item.id}
                                    className="flex flex-col justify-between gap-3 rounded-xl border border-white-dark/20 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-black/40"
                                >
                                    <div>
                                        <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                                            Card {index + 1}
                                        </span>
                                        <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                                            {item.title}
                                        </p>
                                        {item.body && (
                                            <p className="mt-1 line-clamp-3 text-sm text-gray-600 dark:text-gray-300">
                                                {item.body}
                                            </p>
                                        )}
                                        {item.bullets && item.bullets.length > 0 && (
                                            <ul className="mt-2 space-y-1 text-sm text-gray-500">
                                                {item.bullets.slice(0, 3).map((bullet) => (
                                                    <li key={bullet} className="flex gap-2">
                                                        <span className="text-primary">•</span>
                                                        <span>{bullet}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                    {onEditItem && (
                                        <div className="flex justify-end">
                                            <EditorActionButton
                                                label="Edit card"
                                                onClick={() => onEditItem(item)}
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </EditorSection>
    );
};

export default EditorBlockCard;
