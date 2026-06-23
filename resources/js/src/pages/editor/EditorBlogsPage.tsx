import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Newspaper } from "lucide-react";
import moment from "moment";
import React, { useState } from "react";
import { Link } from "react-router-dom";

import Breadcrumb from "../../components/Breadcrumb";
import BlogModal from "../blog/components/BlogModal";
import { blogApi } from "../../services/blog";
import { IBlog } from "../../types";
import EditorEntityListSection from "./components/EditorEntityListSection";
import EditorPageShell from "./components/EditorPageShell";
import EditorSection from "./components/EditorSection";
import EditorTip from "./components/EditorTip";

const EditorBlogsPage = () => {
    const queryClient = useQueryClient();
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState<IBlog | null>(null);

    const { data: blogsResponse, isLoading } = useQuery({
        queryKey: ["editor-blogs"],
        queryFn: () =>
            blogApi.getAll({
                per_page: 100,
                sort_by: "sort_order",
                sort_direction: "asc",
            }),
    });

    const blogs = blogsResponse?.data || [];
    const homeBlogs = blogs
        .filter((blog) => blog.show_on_home)
        .sort((a, b) => (a.home_sort_order ?? 0) - (b.home_sort_order ?? 0));

    const refresh = () => {
        queryClient.invalidateQueries({ queryKey: ["editor-blogs"] });
        queryClient.invalidateQueries({ queryKey: ["Blog Table"] });
    };

    return (
        <>
            <Breadcrumb
                items={[
                    { title: "Dashboard", path: "/dashboard" },
                    { title: "Website Editor", path: "/editor" },
                    { title: "Blog" },
                ]}
            />

            <EditorPageShell
                title="Blog"
                subtitle="Write and manage blog posts. Choose which articles appear in the home page carousel."
                icon={Newspaper}
                tip={
                    <>
                        Edit the home page <strong>Blogs</strong> section title on the{" "}
                        <Link to="/editor/home" className="font-semibold text-primary">
                            Home page editor
                        </Link>
                        . Article content is managed here.
                    </>
                }
            >
                <EditorEntityListSection
                    title="All articles"
                    description="Every blog post on your site. Turn on “Show on home page” when editing to feature one in the carousel."
                    items={blogs}
                    isLoading={isLoading}
                    emptyMessage="No blog posts yet."
                    emptyHint="Add your first article with a title, image, and excerpt."
                    onAdd={() => {
                        setSelectedBlog(null);
                        setModalOpen(true);
                    }}
                    onEdit={(blog) => {
                        setSelectedBlog(blog);
                        setModalOpen(true);
                    }}
                    addLabel="Add article"
                    editLabel="Edit article"
                    renderItem={(blog) => (
                        <div className="flex items-start gap-3">
                            {blog.featured_image?.url ? (
                                <img
                                    src={blog.featured_image.url}
                                    alt={blog.title}
                                    className="h-14 w-14 shrink-0 rounded-lg object-cover"
                                />
                            ) : (
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-white-dark/10 text-xs text-gray-400">
                                    No image
                                </div>
                            )}
                            <div className="min-w-0">
                                <p className="font-semibold text-gray-900 dark:text-white">
                                    {blog.title}
                                </p>
                                {blog.excerpt && (
                                    <p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
                                        {blog.excerpt}
                                    </p>
                                )}
                                <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500">
                                    {blog.show_on_home && (
                                        <span className="rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary">
                                            On home
                                        </span>
                                    )}
                                    {blog.published_at && (
                                        <span>
                                            {moment(blog.published_at).format("MMM D, YYYY")}
                                        </span>
                                    )}
                                    {blog.external_link && <span>External link</span>}
                                </div>
                            </div>
                        </div>
                    )}
                />

                <EditorSection
                    title="Home carousel preview"
                    description="Posts marked “Show on home page”, in carousel order."
                >
                    {homeBlogs.length === 0 ? (
                        <p className="text-sm text-gray-500">
                            No articles are set to show on the home page yet.
                        </p>
                    ) : (
                        <div className="grid gap-3 md:grid-cols-2">
                            {homeBlogs.map((blog) => (
                                <div
                                    key={blog.id}
                                    className="rounded-xl border border-white-dark/20 bg-white-light/30 p-4 dark:border-white/10 dark:bg-white/5"
                                >
                                    <p className="font-semibold text-gray-900 dark:text-white">
                                        {blog.title}
                                    </p>
                                    <p className="mt-1 text-xs text-gray-500">
                                        Home order: {blog.home_sort_order ?? 0}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </EditorSection>

                <EditorTip variant="info">
                    When you&apos;re done, use the sidebar to return to{" "}
                    <strong>Website Editor</strong>.
                </EditorTip>
            </EditorPageShell>

            <BlogModal
                isOpen={modalOpen}
                setIsOpen={(open) => {
                    setModalOpen(open);
                    if (!open) {
                        setSelectedBlog(null);
                        refresh();
                    }
                }}
                blogToEdit={selectedBlog}
            />
        </>
    );
};

export default EditorBlogsPage;
