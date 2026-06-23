import { BaseApi } from "./baseApi";
import { IBlog } from "../types";

class BlogApi extends BaseApi<IBlog> {
    constructor() {
        super("/blogs");
    }
}

export const blogApi = new BlogApi();
