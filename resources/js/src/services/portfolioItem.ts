import { BaseApi } from "./baseApi";
import { IPortfolioItem } from "../types";

class PortfolioItemApi extends BaseApi<IPortfolioItem> {
    constructor() {
        super("/portfolio-items");
    }
}

export const portfolioItemApi = new PortfolioItemApi();
