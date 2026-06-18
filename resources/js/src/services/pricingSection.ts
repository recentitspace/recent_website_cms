import { BaseApi } from "./baseApi";
import { IPricingSection } from "../types";

class PricingSectionApi extends BaseApi<IPricingSection> {
    constructor() {
        super("/pricing-sections");
    }
}

export const pricingSectionApi = new PricingSectionApi();
