import axiosInstance from "../utils/axios";
import { DashboardData } from "../types/dashboard";

class DashboardService {
    async getOverview(): Promise<DashboardData> {
        const response = await axiosInstance.get("/dashboard");
        return response.data.data;
    }
}

const dashboardService = new DashboardService();

export default dashboardService;
