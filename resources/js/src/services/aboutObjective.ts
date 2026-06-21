import { BaseApi } from "./baseApi";
import { IAboutObjective } from "../types";

class AboutObjectiveApi extends BaseApi<IAboutObjective> {
    constructor() {
        super("/about-objectives");
    }
}

export const aboutObjectiveApi = new AboutObjectiveApi();
