import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import type { ReactNode } from "react";
import {
    Activity,
    Box,
    Layers,
    Loader2,
    RefreshCw,
    Sparkles,
    Globe,
} from "lucide-react";
import { Link } from "react-router-dom";
import { ApexOptions } from "apexcharts";

import ActivityList from "../../components/dashboard/ActivityList";
import ChartCard from "../../components/dashboard/ChartCard";
import Breadcrumb from "../../components/Breadcrumb";
import dashboardService from "../../services/dashboard";
import { DashboardContentGroup, DashboardGroupItem } from "../../types/dashboard";

const typeBadgeClass: Record<string, string> = {
    blog: "bg-violet-500/15 text-violet-600",
    portfolio_item: "bg-emerald-500/15 text-emerald-600",
    service_item: "bg-blue-500/15 text-blue-600",
    page_block: "bg-amber-500/15 text-amber-600",
    domain_request: "bg-cyan-500/15 text-cyan-600",
    client: "bg-orange-500/15 text-orange-600",
};

const OverviewCard = ({
    title,
    value,
    subtitle,
    icon,
}: {
    title: string;
    value: number;
    subtitle: string;
    icon: ReactNode;
}) => (
    <div className="panel flex items-center justify-between gap-4">
        <div>
            <p className="text-sm text-white-dark">{title}</p>
            <h3 className="mt-1 text-3xl font-bold dark:text-white-light">{value}</h3>
            <p className="mt-1 text-xs text-white-dark">{subtitle}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            {icon}
        </div>
    </div>
);

const ContentGroupPanel = ({ group }: { group: DashboardContentGroup }) => (
    <div className="panel h-full">
        <h5 className="mb-4 text-lg font-semibold dark:text-white-light">{group.title}</h5>
        <div className="space-y-3">
            {group.items.map((item: DashboardGroupItem) => (
                <Link
                    key={`${group.title}-${item.label}`}
                    to={item.path}
                    className="flex items-center justify-between rounded-md border border-white-light px-4 py-3 transition hover:bg-white-light/40 dark:border-[#1b2e4b] dark:hover:bg-[#1b2e4b]/40"
                >
                    <div>
                        <p className="font-medium dark:text-white-light">{item.label}</p>
                        <p className="text-xs text-white-dark">
                            {item.active !== null
                                ? `${item.active} active · ${item.this_month} this month`
                                : `${item.this_month} this month`}
                        </p>
                    </div>
                    <span className="text-xl font-bold text-primary">{item.total}</span>
                </Link>
            ))}
        </div>
    </div>
);

const Dashboard = () => {
    const { data, isLoading, isFetching, refetch, dataUpdatedAt } = useQuery({
        queryKey: ["dashboard-overview"],
        queryFn: () => dashboardService.getOverview(),
    });

    const contentChartOptions: ApexOptions = {
        plotOptions: {
            bar: {
                borderRadius: 8,
                columnWidth: "50%",
            },
        },
        xaxis: {
            categories: data?.content_chart.labels ?? [],
        },
        colors: ["#4361ee"],
    };

    const typeChartOptions: ApexOptions = {
        labels: data?.content_by_type.map((item) => item.label) ?? [],
        legend: {
            position: "bottom",
        },
        colors: ["#4361ee", "#00ab55", "#805dca", "#209BD0", "#e2a03f", "#e7515a", "#3b3f5c", "#2196f3", "#ff9800", "#8bc34a", "#9c27b0"],
    };

    return (
        <div>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <Breadcrumb items={[{ title: "Dashboard" }]} />
                <button
                    type="button"
                    className="btn btn-outline-primary flex items-center gap-2"
                    onClick={() => refetch()}
                    disabled={isFetching}
                >
                    <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
                    Refresh
                </button>
            </div>

            {isLoading ? (
                <div className="panel flex min-h-[320px] items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : data ? (
                <div className="space-y-6">
                    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                        <OverviewCard
                            title="Total CMS Items"
                            value={data.overview.total_content}
                            subtitle="Across all website content modules"
                            icon={<Box className="h-6 w-6" />}
                        />
                        <OverviewCard
                            title="Created This Month"
                            value={data.overview.created_this_month}
                            subtitle="New content added in the current month"
                            icon={<Sparkles className="h-6 w-6" />}
                        />
                        <OverviewCard
                            title="Active on Website"
                            value={data.overview.active_items}
                            subtitle="Published or active content items"
                            icon={<Activity className="h-6 w-6" />}
                        />
                        <OverviewCard
                            title="Pending Domain Requests"
                            value={data.overview.pending_domain_requests}
                            subtitle="Requires follow-up from the team"
                            icon={<Globe className="h-6 w-6" />}
                        />
                    </div>

                    <div className="grid gap-6 xl:grid-cols-2">
                        <ChartCard
                            title="CMS Content Growth"
                            subtitle="All new items created over the last 6 months"
                            type="bar"
                            height={320}
                            loading={isFetching}
                            series={[
                                {
                                    name: "New Items",
                                    data: data.content_chart.data,
                                },
                            ]}
                            options={contentChartOptions}
                        />
                        <ChartCard
                            title="Content Distribution"
                            subtitle="Breakdown of items across CMS modules"
                            type="donut"
                            height={320}
                            loading={isFetching}
                            series={data.content_by_type.map((item) => item.count)}
                            options={typeChartOptions}
                        />
                    </div>

                    <div>
                        <div className="mb-4 flex items-center gap-2">
                            <Layers className="h-5 w-5 text-primary" />
                            <h4 className="text-lg font-semibold dark:text-white-light">Content Overview</h4>
                        </div>
                        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                            {data.content_groups.map((group) => (
                                <ContentGroupPanel key={group.title} group={group} />
                            ))}
                        </div>
                    </div>

                    <div className="grid gap-6 xl:grid-cols-2">
                        <div className="panel h-full">
                            <div className="mb-5 flex items-center justify-between">
                                <h5 className="text-lg font-semibold dark:text-white-light">
                                    Recent Content Updates
                                </h5>
                                <Link
                                    to="/editor"
                                    className="text-sm font-semibold text-primary hover:underline"
                                >
                                    Open Editor
                                </Link>
                            </div>

                            {data.recent_updates.length === 0 ? (
                                <p className="text-white-dark">No recent content updates yet.</p>
                            ) : (
                                <div className="space-y-3">
                                    {data.recent_updates.map((item) => (
                                        <Link
                                            key={`${item.type}-${item.id}`}
                                            to={item.path}
                                            className="block rounded-md border border-white-light p-4 transition hover:bg-white-light/40 dark:border-[#1b2e4b] dark:hover:bg-[#1b2e4b]/40"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <span
                                                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${typeBadgeClass[item.type] || "bg-primary/10 text-primary"}`}
                                                    >
                                                        {item.label}
                                                    </span>
                                                    <h6 className="mt-2 truncate font-semibold dark:text-white-light">
                                                        {item.title}
                                                    </h6>
                                                </div>
                                                {item.created_at && (
                                                    <p className="shrink-0 text-xs text-white-dark">
                                                        {format(parseISO(item.created_at), "MMM dd, yyyy")}
                                                    </p>
                                                )}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="panel h-full">
                            <ActivityList
                                title="Recent CMS Activity"
                                activities={data.recent_activity}
                                viewAllLink="/logs"
                            />
                        </div>
                    </div>

                    <div className="text-xs text-gray-500 dark:text-gray-400">
                        Last updated: {format(new Date(dataUpdatedAt), "MMM dd, yyyy HH:mm")}
                    </div>
                </div>
            ) : (
                <div className="panel">
                    <p className="text-white-dark">Unable to load dashboard data.</p>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
