import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import {
    BookOpen,
    Globe,
    Handshake,
    Image,
    Loader2,
    MessageSquareQuote,
    RefreshCw,
    Briefcase,
} from "lucide-react";
import { Link } from "react-router-dom";

import ActivityList from "../../components/dashboard/ActivityList";
import ChartCard from "../../components/dashboard/ChartCard";
import StatCard from "../../components/dashboard/StatCard";
import Breadcrumb from "../../components/Breadcrumb";
import dashboardService from "../../services/dashboard";
import { ApexOptions } from "apexcharts";

const statusClass: Record<string, string> = {
    pending: "text-warning",
    contacted: "text-primary",
    canceled: "text-danger",
    completed: "text-success",
};

const Dashboard = () => {
    const { data, isLoading, isFetching, refetch, dataUpdatedAt } = useQuery({
        queryKey: ["dashboard-overview"],
        queryFn: () => dashboardService.getOverview(),
    });

    const domainChartOptions: ApexOptions = {
        plotOptions: {
            bar: {
                borderRadius: 8,
                columnWidth: "45%",
            },
        },
        xaxis: {
            categories: data?.domain_requests_chart.labels ?? [],
        },
        colors: ["#209BD0"],
    };

    const statusChartOptions: ApexOptions = {
        labels: ["Pending", "Contacted", "Canceled", "Completed"],
        colors: ["#e2a03f", "#4361ee", "#e7515a", "#00ab55"],
        legend: {
            position: "bottom",
        },
    };

    const statCards = data
        ? [
              {
                  key: "domain_requests",
                  title: "Domain Requests",
                  count: data.summary.domain_requests.total,
                  previousCount: data.summary.domain_requests.previous_month,
                  linkTo: "/domain-requests",
                  gradientColors: "bg-gradient-to-r from-cyan-500 to-blue-600",
                  badgeText: `${data.domain_requests_pending} pending`,
                  icon: <Globe className="w-5 h-5 mr-2" />,
              },
              {
                  key: "blogs",
                  title: "Blogs",
                  count: data.summary.blogs.total,
                  previousCount: data.summary.blogs.previous_month,
                  linkTo: "/blogs",
                  gradientColors: "bg-gradient-to-r from-violet-500 to-purple-600",
                  badgeText: `${data.summary.blogs.this_month} this month`,
                  icon: <BookOpen className="w-5 h-5 mr-2" />,
              },
              {
                  key: "portfolio_items",
                  title: "Portfolio",
                  count: data.summary.portfolio_items.total,
                  previousCount: data.summary.portfolio_items.previous_month,
                  linkTo: "/portfolio-items",
                  gradientColors: "bg-gradient-to-r from-emerald-500 to-green-600",
                  badgeText: `${data.summary.portfolio_items.this_month} this month`,
                  icon: <Briefcase className="w-5 h-5 mr-2" />,
              },
              {
                  key: "clients",
                  title: "Clients",
                  count: data.summary.clients.total,
                  previousCount: data.summary.clients.previous_month,
                  linkTo: "/clients",
                  gradientColors: "bg-gradient-to-r from-orange-500 to-amber-600",
                  badgeText: `${data.summary.clients.this_month} this month`,
                  icon: <Handshake className="w-5 h-5 mr-2" />,
              },
              {
                  key: "testimonials",
                  title: "Testimonials",
                  count: data.summary.testimonials.total,
                  previousCount: data.summary.testimonials.previous_month,
                  linkTo: "/testimonials",
                  gradientColors: "bg-gradient-to-r from-pink-500 to-rose-600",
                  badgeText: `${data.summary.testimonials.this_month} this month`,
                  icon: <MessageSquareQuote className="w-5 h-5 mr-2" />,
              },
              {
                  key: "media",
                  title: "Media",
                  count: data.summary.media.total,
                  previousCount: data.summary.media.previous_month,
                  linkTo: "/media",
                  gradientColors: "bg-gradient-to-r from-slate-600 to-slate-800",
                  badgeText: `${data.summary.media.this_month} this month`,
                  icon: <Image className="w-5 h-5 mr-2" />,
              },
          ]
        : [];

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
                    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                        {statCards.map((card) => (
                            <StatCard key={card.key} {...card} />
                        ))}
                    </div>

                    <div className="grid gap-6 xl:grid-cols-2">
                        <ChartCard
                            title="Domain Requests"
                            subtitle="New requests over the last 6 months"
                            type="bar"
                            height={320}
                            loading={isFetching}
                            series={[
                                {
                                    name: "Requests",
                                    data: data.domain_requests_chart.data,
                                },
                            ]}
                            options={domainChartOptions}
                        />
                        <ChartCard
                            title="Request Status"
                            subtitle="Current breakdown of domain requests"
                            type="donut"
                            height={320}
                            loading={isFetching}
                            series={[
                                data.domain_requests_by_status.pending,
                                data.domain_requests_by_status.contacted,
                                data.domain_requests_by_status.canceled,
                                data.domain_requests_by_status.completed,
                            ]}
                            options={statusChartOptions}
                        />
                    </div>

                    <div className="grid gap-6 xl:grid-cols-2">
                        <div className="panel h-full">
                            <div className="mb-5 flex items-center justify-between">
                                <h5 className="text-lg font-semibold dark:text-white-light">
                                    Recent Domain Requests
                                </h5>
                                <Link
                                    to="/domain-requests"
                                    className="text-sm font-semibold text-primary hover:underline"
                                >
                                    View All
                                </Link>
                            </div>

                            {data.recent_domain_requests.length === 0 ? (
                                <p className="text-white-dark">No domain requests yet.</p>
                            ) : (
                                <div className="space-y-3">
                                    {data.recent_domain_requests.map((request) => (
                                        <Link
                                            key={request.id}
                                            to={`/domain-requests?view=${request.id}`}
                                            className="block rounded-md border border-white-light p-4 transition hover:bg-white-light/40 dark:border-[#1b2e4b] dark:hover:bg-[#1b2e4b]/40"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <h6 className="font-semibold dark:text-white-light">
                                                        {request.full_domain}
                                                    </h6>
                                                    <p className="mt-1 text-sm text-white-dark">
                                                        {request.email} · {request.phone}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <span
                                                        className={`text-xs font-semibold uppercase ${statusClass[request.status] || ""}`}
                                                    >
                                                        {request.status}
                                                    </span>
                                                    {request.created_at && (
                                                        <p className="mt-1 text-xs text-white-dark">
                                                            {format(parseISO(request.created_at), "MMM dd, yyyy")}
                                                        </p>
                                                    )}
                                                </div>
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
