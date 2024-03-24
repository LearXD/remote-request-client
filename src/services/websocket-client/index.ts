import WebSocket from "ws";
import { WebSocketClientConfig } from "./types";
import Request from "../../utils/request";
import Response from "../../utils/response";

export default class WebSocketClient {

    private client: WebSocket;
    private requestsPool: Map<string, Function> = new Map();

    constructor(private config: WebSocketClientConfig) {
        this.client = new WebSocket(`ws://${config.address}:${config.port}`);
    }

    public async init() {
        return new Promise((resolve, reject) => {
            this.client.on('open', () => {
                this.client.on('message', (data: string) => {
                    try {
                        const payload = JSON.parse(data);
                        switch (payload.type) {
                            case 'request':
                                const request = Request.fromString(payload.data);
                                request.execute()
                                    .then((data) => {
                                        this.send({
                                            type: 'response',
                                            uuid: request.getUuid(),
                                            data: new Response(request.getUuid(), data).toString()
                                        })
                                    })
                                    .catch((error) => { })
                                break;
                            case 'response':
                                const callback = this.getRequestCallback(payload.uuid);
                                if (callback) {
                                    callback(Response.fromString(payload.data));
                                    this.requestsPool.delete(payload.uuid);
                                }
                                break;
                        }
                    } catch (error) {
                        console.error('Invalid payload', error)
                    }
                })
                resolve(true)
            })
        })
    }

    public send(payload: Object) {
        this.client.send(JSON.stringify(payload));
    }

    public setRequestCallback(uuid: string, callback: Function) {
        this.requestsPool.set(uuid, callback);
    }

    public getRequestCallback(uuid: string) {
        return this.requestsPool.get(uuid);
    }


}