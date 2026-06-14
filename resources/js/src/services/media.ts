import axiosInstance from "../utils/axios";
import { BaseApi } from "./baseApi";
import { IMedia } from "../types";

class MediaApi extends BaseApi<IMedia> {
    constructor() {
        super("/media");
    }

    async upload(formData: FormData): Promise<IMedia> {
        const response = await axiosInstance.post(this.endpoint, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        return response.data.data || response.data;
    }
}

export const mediaApi = new MediaApi();
