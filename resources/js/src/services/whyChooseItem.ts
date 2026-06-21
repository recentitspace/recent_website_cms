import { BaseApi } from "./baseApi";
import { IWhyChooseItem } from "../types";

class WhyChooseItemApi extends BaseApi<IWhyChooseItem> {
    constructor() {
        super("/why-choose-items");
    }
}

export const whyChooseItemApi = new WhyChooseItemApi();
