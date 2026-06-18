import { BaseApi } from "./baseApi";
import { IServiceCategory } from "../types";

class ServiceCategoryApi extends BaseApi<IServiceCategory> {
    constructor() {
        super("/service-categories");
    }
}

export const serviceCategoryApi = new ServiceCategoryApi();
