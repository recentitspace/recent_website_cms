import { BaseApi } from "./baseApi";
import { IPortfolioCategory } from "../types";

class PortfolioCategoryApi extends BaseApi<IPortfolioCategory> {
    constructor() {
        super("/portfolio-categories");
    }
}

export const portfolioCategoryApi = new PortfolioCategoryApi();
