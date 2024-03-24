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
const websocket_client_1 = __importDefault(require("./services/websocket-client"));
const request_1 = __importDefault(require("./utils/request"));
class RequestManager {
    constructor(config) {
        this.config = config;
        this.requestClient = new websocket_client_1.default({
            address: config.address,
            port: config.port
        });
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.requestClient.init();
            this.requestClient.send({ type: 'identifier', identifier: 'LearXD' });
            return true;
        });
    }
    request(url, options = {}) {
        return new Promise((resolve, reject) => {
            const request = new request_1.default(url, options, this.config.identifier);
            this.requestClient.setRequestCallback(request.getUuid(), (response) => {
                resolve(response.getData());
            });
            this.requestClient.send({
                type: 'request',
                data: request.toString()
            });
        });
    }
}
exports.default = RequestManager;
