import { BaseApi } from "./baseApi";
import axiosInstance from "../utils/axios";
import { IService, IServiceFormData, IServiceReorderItem } from "../types/service";

class ServiceApi extends BaseApi<IService> {
    constructor() {
        super("/services/manage");
    }

    async getTree(): Promise<IService[]> {
        const response = await axiosInstance.get("/services/manage/tree");
        return response.data.data || response.data;
    }

    async reorder(items: IServiceReorderItem[]): Promise<void> {
        await axiosInstance.post("/services/manage/reorder", { items });
    }

    async uploadIcon(id: number, file: File): Promise<IService> {
        const formData = new FormData();
        formData.append("icon", file);
        const response = await axiosInstance.post(`/services/manage/${id}/upload-icon`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data.data || response.data;
    }

    async uploadHeroImage(id: number, file: File): Promise<IService> {
        const formData = new FormData();
        formData.append("hero_image", file);
        const response = await axiosInstance.post(`/services/manage/${id}/upload-hero-image`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data.data || response.data;
    }

    async getReferenceOptions(): Promise<{ portfolio_categories: string[]; pricing_category_slugs: string[] }> {
        const response = await axiosInstance.get("/services/manage/reference-options");
        return response.data.data || response.data;
    }

    async create(data: IServiceFormData): Promise<IService> {
        const response = await axiosInstance.post(this.endpoint, data);
        return response.data.data || response.data;
    }

    async update(id: number, data: IServiceFormData): Promise<IService> {
        const response = await axiosInstance.patch(`${this.endpoint}/${id}`, data);
        return response.data.data || response.data;
    }
}

export const serviceApi = new ServiceApi();
