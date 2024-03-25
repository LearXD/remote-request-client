import WebSocketClient from "./services/websocket-client";
import { RequestManagerConfig } from "./types";
export declare class RequestManager {
    private config;
    private requestClient;
    /**
     * @param config Define the configuration of the RequestManager
     */
    constructor(config: RequestManagerConfig);
    /**
     * @description Initialize the WebSocketClient instance
     *
     * @returns Promise<boolean>
     */
    init(): Promise<boolean>;
    /**
     * @description Get the identifier of the client
     *
     * @returns string
     */
    getIdentifier(): string;
    /**
     * @description Get the WebSocketClient instance
     *
     * @returns WebSocketClient
     */
    getRequestClient(): WebSocketClient;
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
