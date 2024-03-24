import { RequestManagerConfig } from "./types";
export default class RequestManager {
    private config;
    private requestClient;
    constructor(config: RequestManagerConfig);
    init(): Promise<boolean>;
    request(url: string, options?: RequestInit): Promise<string>;
}
