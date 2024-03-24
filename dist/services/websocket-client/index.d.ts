import { WebSocketClientConfig } from "./types";
export default class WebSocketClient {
    private config;
    private client;
    private requestsPool;
    constructor(config: WebSocketClientConfig);
    init(): Promise<unknown>;
    send(payload: Object): void;
    setRequestCallback(uuid: string, callback: Function): void;
    getRequestCallback(uuid: string): Function;
}
