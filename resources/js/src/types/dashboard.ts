export interface DashboardCountStat {
    total: number;
    this_month: number;
    previous_month: number;
}

export interface DashboardRecentDomainRequest {
    id: number;
    full_domain: string;
    email: string;
    phone: string;
    status: string;
    created_at?: string;
}

export interface DashboardActivityItem {
    id: number;
    title: string;
    description: string;
    time: string;
    status: "completed" | "pending" | "in-progress";
}

export interface DashboardData {
    summary: {
        domain_requests: DashboardCountStat;
        blogs: DashboardCountStat;
        portfolio_items: DashboardCountStat;
        clients: DashboardCountStat;
        testimonials: DashboardCountStat;
        media: DashboardCountStat;
    };
    domain_requests_pending: number;
    domain_requests_by_status: {
        pending: number;
        contacted: number;
        canceled: number;
        completed: number;
    };
    domain_requests_chart: {
        labels: string[];
        data: number[];
    };
    recent_domain_requests: DashboardRecentDomainRequest[];
    recent_activity: DashboardActivityItem[];
}
