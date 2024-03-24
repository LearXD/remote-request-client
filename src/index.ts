import WebSocketClient from "./services/websocket-client";
import { RequestManagerConfig } from "./types";
import Request from "./utils/request";
import Response from "./utils/response";

export default class RequestManager {

    private requestClient: WebSocketClient;

    constructor(private config: RequestManagerConfig) {
        this.requestClient = new WebSocketClient({
            address: config.address,
            port: config.port
        });
    }

    public async init() {
        await this.requestClient.init();
        this.requestClient.send({ type: 'identifier', identifier: 'LearXD' })
        return true
    }

    public request(url: string, options: RequestInit = {}): Promise<string> {
        return new Promise((resolve, reject) => {
            const request = new Request(url, options, this.config.identifier);
            this.requestClient.setRequestCallback(request.getUuid(), (response: Response) => {
                resolve(response.getData())
            })
            this.requestClient.send({
                type: 'request',
                data: request.toString()
            })
        })
    }
}