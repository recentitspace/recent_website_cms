import { BaseApi } from "./baseApi";
import { IPageBlock } from "../types";

class PageBlockApi extends BaseApi<IPageBlock> {
    constructor() {
        super("/page-blocks");
    }
}

export const pageBlockApi = new PageBlockApi();
