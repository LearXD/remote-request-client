import { RequestManagerConfig } from "./types";
export declare class RequestManager {
    private config;
    private requestClient;
    constructor(config: RequestManagerConfig);
    init(): Promise<boolean>;
    /**
     * @description Define the identifier of the client you want to execute the request, the other parameters are identical to fetch()
     *
     * @param idendifier
     * @param url
     * @param options
     * @returns Promise<string>
     */
    request(idendifier: string, url: string, options?: RequestInit): Promise<string>;
}
