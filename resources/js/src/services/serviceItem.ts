import { BaseApi } from "./baseApi";
import { IServiceItem } from "../types";

class ServiceItemApi extends BaseApi<IServiceItem> {
    constructor() {
        super("/service-items");
    }
}

export const serviceItemApi = new ServiceItemApi();
