import { BaseApi } from "./baseApi";
import { IDomainRequest } from "../types/domainRequest";

class DomainRequestApi extends BaseApi<IDomainRequest> {
    constructor() {
        super("/domain-requests");
    }
}

export const domainRequestApi = new DomainRequestApi();
