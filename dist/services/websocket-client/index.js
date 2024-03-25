"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
const request_1 = __importDefault(require("../../utils/request"));
const response_1 = __importDefault(require("../../utils/response"));
const error_1 = __importDefault(require("../../utils/error"));
const events_1 = __importDefault(require("events"));
class WebSocketClient extends events_1.default {
    constructor(config) {
        super();
        this.config = config;
        this.requestsPool = new Map();
        this.client = new ws_1.default(`ws://${config.address}:${config.port}`);
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.client.on('open', () => {
                    this.emit('open');
                    this.client.on('message', (data) => {
                        try {
                            const payload = JSON.parse(data);
                            switch (payload.type) {
                                case 'request':
                                    const request = request_1.default.fromString(payload.data);
                                    this.emit('request', request);
                                    process.argv.includes('--debug') && console.log(`Executing request ${request.getUuid()}`);
                                    request.execute()
                                        .then((data) => {
                                        this.send({
                                            type: 'response',
                                            uuid: request.getUuid(),
                                            data: new response_1.default(request.getUuid(), data).toString()
                                        });
                                    })
                                        .catch((error) => {
                                        var _a;
                                        this.send(new error_1.default((_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : "Request failed", request.getUuid()).toString());
                                        return;
                                    });
                                    break;
                                case 'response':
                                    process.argv.includes('--debug') && console.log(`Received response ${payload.uuid}`);
                                    const response = response_1.default.fromString(payload.data);
                                    this.emit('response', response);
                                    const callback = this.getRequestCallback(payload.uuid);
                                    if (callback) {
                                        callback(response);
                                        this.requestsPool.delete(payload.uuid);
                                    }
                                    break;
                                case 'error':
                                    const error = error_1.default.fromString(data);
                                    if (error.getRequestUuid()) {
                                        const callback = this.getRequestCallback(error.getRequestUuid());
                                        if (callback) {
                                            callback(null, error);
                                            this.requestsPool.delete(payload.uuid);
                                        }
                                    }
                                    break;
                            }
                        }
                        catch (error) {
                            console.error('Invalid payload', error);
                        }
                    });
                    resolve(true);
                });
                this.client.on('error', (error) => {
                    console.error('WebSocket error', error);
                });
                this.client.on('close', () => {
                    console.log('WebSocket Client closed connection. Reconnecting...');
                    this.client.removeAllListeners();
                    this.client = new ws_1.default(`ws://${this.config.address}:${this.config.port}`);
                    this.init();
                });
            });
        });
    }
    send(payload) {
        this.client.send(JSON.stringify(payload));
    }
    setRequestCallback(uuid, callback) {
        this.requestsPool.set(uuid, callback);
    }
    getRequestCallback(uuid) {
        return this.requestsPool.get(uuid);
    }
}
exports.default = WebSocketClient;
