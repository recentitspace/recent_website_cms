export interface DashboardCountStat {
    total: number;
    this_month: number;
    previous_month: number;
}

export interface DashboardOverview {
    total_content: number;
    created_this_month: number;
    active_items: number;
    pending_domain_requests: number;
}

export interface DashboardContentType {
    label: string;
    count: number;
}

export interface DashboardGroupItem {
    label: string;
    total: number;
    active: number | null;
    this_month: number;
    path: string;
}

export interface DashboardContentGroup {
    title: string;
    items: DashboardGroupItem[];
}

export interface DashboardRecentUpdate {
    id: number;
    type: string;
    label: string;
    title: string;
    path: string;
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
    overview: DashboardOverview;
    summary: Record<string, DashboardCountStat>;
    active_counts: Record<string, number>;
    content_by_type: DashboardContentType[];
    content_chart: {
        labels: string[];
        data: number[];
    };
    content_groups: DashboardContentGroup[];
    recent_updates: DashboardRecentUpdate[];
    recent_activity: DashboardActivityItem[];
}
