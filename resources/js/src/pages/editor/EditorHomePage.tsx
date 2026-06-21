import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";

import ClientModal from "../client/components/ClientModal";
import StatCounterModal from "../stat-counter/components/StatCounterModal";
import TestimonialModal from "../testimonial/components/TestimonialModal";
import { clientApi } from "../../services/client";
import { statCounterApi } from "../../services/statCounter";
import { testimonialApi } from "../../services/testimonial";
import { IClient, IStatCounter, ITestimonial } from "../../types";
import EditorEntityListSection from "./components/EditorEntityListSection";
import PageEditorLayout from "./components/PageEditorLayout";

const EditorHomePage = () => {
    const queryClient = useQueryClient();

    const [counterModalOpen, setCounterModalOpen] = useState(false);
    const [clientModalOpen, setClientModalOpen] = useState(false);
    const [testimonialModalOpen, setTestimonialModalOpen] = useState(false);
    const [selectedCounter, setSelectedCounter] = useState<IStatCounter | null>(null);
    const [selectedClient, setSelectedClient] = useState<IClient | null>(null);
    const [selectedTestimonial, setSelectedTestimonial] = useState<ITestimonial | null>(null);

    const { data: countersResponse, isLoading: countersLoading } = useQuery({
        queryKey: ["editor-home-counters"],
        queryFn: () =>
            statCounterApi.getAll({
                per_page: 100,
                sort_by: "sort_order",
                sort_direction: "asc",
            }),
    });

    const { data: clientsResponse, isLoading: clientsLoading } = useQuery({
        queryKey: ["editor-home-clients"],
        queryFn: () =>
            clientApi.getAll({
                per_page: 100,
                sort_by: "sort_order",
                sort_direction: "asc",
            }),
    });

    const { data: testimonialsResponse, isLoading: testimonialsLoading } = useQuery({
        queryKey: ["editor-home-testimonials"],
        queryFn: () =>
            testimonialApi.getAll({
                per_page: 100,
                sort_by: "sort_order",
                sort_direction: "asc",
            }),
    });

    const refreshLists = () => {
        queryClient.invalidateQueries({ queryKey: ["editor-home-counters"] });
        queryClient.invalidateQueries({ queryKey: ["editor-home-clients"] });
        queryClient.invalidateQueries({ queryKey: ["editor-home-testimonials"] });
    };

    return (
        <>
            <PageEditorLayout page="home">
                <EditorEntityListSection
                    title="By the numbers"
                    description="The big statistics visitors see on your homepage — for example “150+ projects completed”."
                    items={countersResponse?.data || []}
                    isLoading={countersLoading}
                    emptyMessage="No statistics added yet."
                    emptyHint="Add numbers that build trust, like years of experience or happy clients."
                    onAdd={() => {
                        setSelectedCounter(null);
                        setCounterModalOpen(true);
                    }}
                    onEdit={(counter) => {
                        setSelectedCounter(counter);
                        setCounterModalOpen(true);
                    }}
                    addLabel="Add statistic"
                    editLabel="Edit statistic"
                    renderItem={(counter) => (
                        <div className="rounded-lg bg-primary/5 px-4 py-3 text-center dark:bg-primary/10">
                            <p className="text-2xl font-bold text-primary">
                                {counter.value}
                                {counter.suffix}
                            </p>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                                {counter.label}
                            </p>
                        </div>
                    )}
                />

                <EditorEntityListSection
                    title="Client logos"
                    description="Company logos displayed in a row on the homepage to show who you work with."
                    items={clientsResponse?.data || []}
                    isLoading={clientsLoading}
                    emptyMessage="No client logos yet."
                    emptyHint="Upload each client's logo and name. They appear in a scrolling row on the home page."
                    onAdd={() => {
                        setSelectedClient(null);
                        setClientModalOpen(true);
                    }}
                    onEdit={(client) => {
                        setSelectedClient(client);
                        setClientModalOpen(true);
                    }}
                    addLabel="Add client logo"
                    editLabel="Edit logo"
                    renderItem={(client) => (
                        <div className="flex items-center gap-3">
                            {client.logo?.url ? (
                                <img
                                    src={client.logo.url}
                                    alt={client.name}
                                    className="h-12 w-12 rounded-lg border border-white-dark/20 bg-white object-contain p-1 dark:border-white/10"
                                />
                            ) : (
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white-dark/10 text-xs text-gray-400">
                                    No logo
                                </div>
                            )}
                            <span className="font-medium text-gray-800 dark:text-gray-100">
                                {client.name}
                            </span>
                        </div>
                    )}
                />

                <EditorEntityListSection
                    title="What clients say"
                    description="Short quotes from happy clients shown in the testimonials carousel."
                    items={testimonialsResponse?.data || []}
                    isLoading={testimonialsLoading}
                    emptyMessage="No testimonials yet."
                    emptyHint="Add a client name, their quote, and optionally a photo."
                    onAdd={() => {
                        setSelectedTestimonial(null);
                        setTestimonialModalOpen(true);
                    }}
                    onEdit={(testimonial) => {
                        setSelectedTestimonial(testimonial);
                        setTestimonialModalOpen(true);
                    }}
                    addLabel="Add testimonial"
                    editLabel="Edit quote"
                    renderItem={(testimonial) => (
                        <div>
                            <p className="text-sm italic leading-relaxed text-gray-600 dark:text-gray-300">
                                &ldquo;{testimonial.quote}&rdquo;
                            </p>
                            <p className="mt-2 font-semibold text-gray-800 dark:text-gray-100">
                                — {testimonial.author_name}
                            </p>
                        </div>
                    )}
                />
            </PageEditorLayout>

            <StatCounterModal
                isOpen={counterModalOpen}
                setIsOpen={(open) => {
                    setCounterModalOpen(open);
                    if (!open) {
                        setSelectedCounter(null);
                        refreshLists();
                    }
                }}
                counterToEdit={selectedCounter}
            />

            <ClientModal
                isOpen={clientModalOpen}
                setIsOpen={(open) => {
                    setClientModalOpen(open);
                    if (!open) {
                        setSelectedClient(null);
                        refreshLists();
                    }
                }}
                clientToEdit={selectedClient}
            />

            <TestimonialModal
                isOpen={testimonialModalOpen}
                setIsOpen={(open) => {
                    setTestimonialModalOpen(open);
                    if (!open) {
                        setSelectedTestimonial(null);
                        refreshLists();
                    }
                }}
                testimonialToEdit={selectedTestimonial}
            />
        </>
    );
};

export default EditorHomePage;
