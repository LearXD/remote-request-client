import WebSocketClient from "./services/websocket-client";
import { RequestManagerConfig } from "./types";
import Request from "./utils/request";
import Response from "./utils/response";

export class RequestManager {

    private requestClient: WebSocketClient;

    constructor(private config: RequestManagerConfig) {
        this.requestClient = new WebSocketClient({ address: config.address, port: config.port });
    }

    public async init() {
        await this.requestClient.init();
        this.requestClient.send({ type: 'identifier', identifier: this.config.identifier })
        return true
    }

    /**
     * @description Define the identifier of the client you want to execute the request, the other parameters are identical to fetch()
     * 
     * @param idendifier 
     * @param url 
     * @param options 
     * @returns Promise<string>
     */
    public request(idendifier: string, url: string, options: RequestInit = {}): Promise<string> {
        return new Promise((resolve, reject) => {
            const request = new Request(url, options, idendifier);
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