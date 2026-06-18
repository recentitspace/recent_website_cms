import { BaseApi } from "./baseApi";
import { IStatCounter } from "../types";

class StatCounterApi extends BaseApi<IStatCounter> {
    constructor() {
        super("/stat-counters");
    }
}

export const statCounterApi = new StatCounterApi();
