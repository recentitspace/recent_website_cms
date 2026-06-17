import { BaseApi } from "./baseApi";
import { IClient } from "../types";

class ClientApi extends BaseApi<IClient> {
    constructor() {
        super("/clients");
    }
}

export const clientApi = new ClientApi();
