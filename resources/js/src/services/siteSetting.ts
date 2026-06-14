import axiosInstance from "../utils/axios";
import { ISiteSetting } from "../types";

class SiteSettingApi {
    private endpoint = "/site-settings";

    async get(): Promise<ISiteSetting> {
        const response = await axiosInstance.get(this.endpoint);
        return response.data.data;
    }

    async update(data: Partial<ISiteSetting>): Promise<ISiteSetting> {
        const response = await axiosInstance.put(this.endpoint, data);
        return response.data.data;
    }
}

export const siteSettingApi = new SiteSettingApi();
