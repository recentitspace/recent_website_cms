import { BaseApi } from "./baseApi";
import { IDomainExtension } from "../types";

class DomainExtensionApi extends BaseApi<IDomainExtension> {
    constructor() {
        super("/domain-extensions");
    }
}

export const domainExtensionApi = new DomainExtensionApi();
