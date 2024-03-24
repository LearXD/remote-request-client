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
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
class Request {
    constructor(url, options, target, uuid = (0, uuid_1.v4)()) {
        this.url = url;
        this.options = options;
        this.target = target;
        this.uuid = uuid;
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            return fetch(this.url, this.options)
                .then(response => response.text());
        });
    }
    static fromString(data) {
        const { url, options, uuid, target } = JSON.parse(data);
        if (!url || !options || !uuid || !target) {
            throw new Error('Invalid data');
        }
        return new Request(url, options, target, uuid);
    }
    getUuid() {
        return this.uuid;
    }
    getTarget() {
        return this.target;
    }
    toString() {
        return JSON.stringify({
            uuid: this.uuid,
            target: this.target,
            url: this.url,
            options: this.options
        });
    }
}
exports.default = Request;
