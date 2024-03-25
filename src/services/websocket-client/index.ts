import WebSocket from "ws";
import { WebSocketClientConfig } from "./types";
import Request from "../../utils/request";
import Response from "../../utils/response";
import Error from "../../utils/error";

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
                                console.log(`Executing request ${request.getUuid()}`)
                                request.execute()
                                    .then((data) => {
                                        this.send({
                                            type: 'response',
                                            uuid: request.getUuid(),
                                            data: new Response(request.getUuid(), data).toString()
                                        })
                                    })
                                    .catch((error) => {
                                        this.send(new Error(error?.message ?? "Request failed", request.getUuid()).toString())
                                        return
                                    })
                                break;
                            case 'response':
                                console.log(`Received response ${payload.uuid}`)
                                const callback = this.getRequestCallback(payload.uuid);
                                if (callback) {
                                    callback(Response.fromString(payload.data));
                                    this.requestsPool.delete(payload.uuid);
                                }
                                break;
                            case 'error':
                                const error = Error.fromString(data);
                                if (error.getRequestUuid()) {
                                    const callback = this.getRequestCallback(error.getRequestUuid());
                                    if (callback) {
                                        callback(null, error);
                                        this.requestsPool.delete(payload.uuid);
                                    }
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