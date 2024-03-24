"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Response {
    constructor(uuid, data) {
        this.uuid = uuid;
        this.data = data;
    }
    getUuid() {
        return this.uuid;
    }
    getData() {
        return this.data;
    }
    static fromString(payload) {
        const { uuid, data } = JSON.parse(payload);
        if (!uuid || !data) {
            throw new Error('Invalid data');
        }
        return new Response(uuid, data);
    }
    toString() {
        return JSON.stringify({
            uuid: this.uuid,
            data: this.data
        });
    }
}
exports.default = Response;
