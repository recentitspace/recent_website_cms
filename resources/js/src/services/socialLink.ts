import { BaseApi } from "./baseApi";
import { ISocialLink } from "../types";

class SocialLinkApi extends BaseApi<ISocialLink> {
    constructor() {
        super("/social-links");
    }
}

export const socialLinkApi = new SocialLinkApi();
