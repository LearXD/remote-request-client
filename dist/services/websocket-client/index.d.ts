/// <reference types="node" />
import { WebSocketClientConfig } from "./types";
import EventEmitter from "events";
export default class WebSocketClient extends EventEmitter {
    private config;
    private client;
    private requestsPool;
    constructor(config: WebSocketClientConfig);
    init(): Promise<unknown>;
    send(payload: Object): void;
    setRequestCallback(uuid: string, callback: Function): void;
    getRequestCallback(uuid: string): Function;
}
