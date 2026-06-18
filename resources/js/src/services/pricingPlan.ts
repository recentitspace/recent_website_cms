import { BaseApi } from "./baseApi";
import { IPricingPlan } from "../types";

class PricingPlanApi extends BaseApi<IPricingPlan> {
    constructor() {
        super("/pricing-plans");
    }
}

export const pricingPlanApi = new PricingPlanApi();
