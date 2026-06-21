import React from "react";
import { Link } from "react-router-dom";

import Breadcrumb from "../../components/Breadcrumb";
import EditorPageShell from "./components/EditorPageShell";

interface EditorPlaceholderPageProps {
    title: string;
    subtitle: string;
    advancedPath: string;
    advancedLabel: string;
}

const EditorPlaceholderPage: React.FC<EditorPlaceholderPageProps> = ({
    title,
    subtitle,
    advancedPath,
    advancedLabel,
}) => {
    return (
        <>
            <Breadcrumb
                items={[
                    { title: "Dashboard", path: "/dashboard" },
                    { title: "Website Editor", path: "/editor" },
                    { title },
                ]}
            />

            <EditorPageShell title={title} subtitle={subtitle}>
                <div className="panel border border-dashed border-primary/30 bg-primary/5 p-6 text-center">
                    <p className="text-gray-600 dark:text-gray-300">
                        This page editor is coming next. For now you can manage this content in
                        Advanced mode.
                    </p>
                    <Link to={advancedPath} className="btn btn-outline-primary mt-4 inline-flex">
                        {advancedLabel}
                    </Link>
                </div>
            </EditorPageShell>
        </>
    );
};

export default EditorPlaceholderPage;
