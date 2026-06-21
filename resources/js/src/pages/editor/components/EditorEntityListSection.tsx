import React, { ReactNode } from "react";

import EditorActionButton from "./EditorActionButton";
import EditorEmptyState from "./EditorEmptyState";
import EditorLoadingState from "./EditorLoadingState";
import EditorSection from "./EditorSection";

interface EditorEntityListSectionProps<T extends { id: number }> {
    title: string;
    description?: string;
    items: T[];
    isLoading?: boolean;
    emptyMessage?: string;
    emptyHint?: string;
    onAdd?: () => void;
    onEdit: (item: T) => void;
    renderItem: (item: T) => ReactNode;
    addLabel?: string;
    editLabel?: string;
    sectionNumber?: number;
}

function EditorEntityListSection<T extends { id: number }>({
    title,
    description,
    items,
    isLoading,
    emptyMessage = "Nothing here yet.",
    emptyHint,
    onAdd,
    onEdit,
    renderItem,
    addLabel = "Add new",
    editLabel = "Edit",
    sectionNumber,
}: EditorEntityListSectionProps<T>) {
    return (
        <EditorSection
            title={title}
            description={description}
            sectionNumber={sectionNumber}
            action={
                onAdd && items.length > 0 ? (
                    <EditorActionButton label={addLabel} onClick={onAdd} variant="primary" />
                ) : undefined
            }
        >
            {isLoading ? (
                <EditorLoadingState />
            ) : items.length === 0 ? (
                <EditorEmptyState
                    message={emptyMessage}
                    hint={emptyHint}
                    onAction={onAdd}
                    actionLabel={addLabel}
                />
            ) : (
                <div className="grid gap-3 md:grid-cols-2">
                    {items.map((item, index) => (
                        <div
                            key={item.id}
                            className="flex flex-col justify-between gap-4 rounded-xl border border-white-dark/20 bg-white-light/30 p-4 dark:border-white/10 dark:bg-white/5"
                        >
                            <div className="min-w-0 flex-1">
                                <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                    Item {index + 1}
                                </span>
                                <div className="mt-2">{renderItem(item)}</div>
                            </div>
                            <div className="flex justify-end">
                                <EditorActionButton
                                    label={editLabel}
                                    onClick={() => onEdit(item)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </EditorSection>
    );
}

export default EditorEntityListSection;
