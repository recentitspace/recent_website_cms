import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

import EditorSection from "./components/EditorSection";
import EditorTip from "./components/EditorTip";
import PageEditorLayout from "./components/PageEditorLayout";

const EditorContactPage = () => {
    return (
        <PageEditorLayout page="contact">
            <EditorSection
                title="Address, phone & email"
                description="These details appear on the contact page cards and across your site."
                sectionNumber={2}
                badge="Managed in one place"
            >
                <div className="grid gap-4 md:grid-cols-3">
                    {[
                        { icon: MapPin, label: "Address" },
                        { icon: Phone, label: "Phone number" },
                        { icon: Mail, label: "Email address" },
                    ].map(({ icon: Icon, label }) => (
                        <div
                            key={label}
                            className="flex items-center gap-3 rounded-xl border border-white-dark/20 bg-white-light/30 p-4 dark:border-white/10 dark:bg-white/5"
                        >
                            <span className="rounded-lg bg-primary/10 p-2 text-primary">
                                <Icon size={18} />
                            </span>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                {label}
                            </span>
                        </div>
                    ))}
                </div>

                <EditorTip>
                    Update your company address, phone, and email in Site Settings. They will
                    automatically show on the contact page — no need to edit them here.
                </EditorTip>

                <Link to="/site-settings" className="btn btn-primary mt-4 inline-flex gap-2">
                    Edit contact details
                    <ArrowRight size={14} />
                </Link>
            </EditorSection>
        </PageEditorLayout>
    );
};

export default EditorContactPage;
