import { BaseApi } from "./baseApi";
import { IAboutDriveItem } from "../types";

class AboutDriveItemApi extends BaseApi<IAboutDriveItem> {
    constructor() {
        super("/about-drive-items");
    }
}

export const aboutDriveItemApi = new AboutDriveItemApi();
