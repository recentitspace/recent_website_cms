import { BaseApi } from "./baseApi";
import { IPageBlockItem } from "../types";

class PageBlockItemApi extends BaseApi<IPageBlockItem> {
    constructor() {
        super("/page-block-items");
    }
}

export const pageBlockItemApi = new PageBlockItemApi();
