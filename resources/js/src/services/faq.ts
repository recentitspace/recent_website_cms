import { BaseApi } from "./baseApi";
import { IFaq } from "../types";

class FaqApi extends BaseApi<IFaq> {
    constructor() {
        super("/faqs");
    }
}

export const faqApi = new FaqApi();
