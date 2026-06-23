import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import React from "react";

import { blogApi } from "../../../services/blog";

interface BlogDetailProps {
    blogId: number | null;
}

const BlogDetail: React.FC<BlogDetailProps> = ({ blogId }) => {
    const { data: blog, isLoading } = useQuery({
        queryKey: ["blog", blogId],
        queryFn: () => (blogId ? blogApi.getById(blogId) : null),
        enabled: !!blogId,
    });

    if (isLoading) {
        return null;
    }

    if (!blog) {
        return (
            <div className="flex h-full items-center justify-center">
                <p className="text-gray-500">No blog post selected</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 text-sm">
            {blog.featured_image?.url && (
                <img
                    src={blog.featured_image.url}
                    alt={blog.title}
                    className="h-40 w-full rounded-lg object-cover"
                />
            )}
            <div>
                <h3 className="text-xl font-bold">{blog.title}</h3>
                <p className="mt-1 text-gray-500">/{blog.slug}</p>
            </div>
            {blog.excerpt && (
                <div>
                    <span className="font-medium text-gray-500">Excerpt</span>
                    <p className="mt-1">{blog.excerpt}</p>
                </div>
            )}
            {blog.author_name && (
                <div>
                    <span className="font-medium text-gray-500">Author</span>
                    <p>{blog.author_name}</p>
                </div>
            )}
            {blog.published_at && (
                <div>
                    <span className="font-medium text-gray-500">Published</span>
                    <p>{moment(blog.published_at).format("MMMM D, YYYY")}</p>
                </div>
            )}
            {blog.external_link && (
                <div>
                    <span className="font-medium text-gray-500">External link</span>
                    <a
                        href={blog.external_link}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 block break-all text-primary"
                    >
                        {blog.external_link}
                    </a>
                </div>
            )}
            {blog.tags && blog.tags.length > 0 && (
                <div>
                    <span className="font-medium text-gray-500">Tags</span>
                    <p>{blog.tags.join(", ")}</p>
                </div>
            )}
            <div>
                <span className="font-medium text-gray-500">Show on Home</span>
                <p>{blog.show_on_home ? "Yes" : "No"}</p>
            </div>
            <div>
                <span className="font-medium text-gray-500">Active</span>
                <p>{blog.is_active ? "Yes" : "No"}</p>
            </div>
        </div>
    );
};

export default BlogDetail;
