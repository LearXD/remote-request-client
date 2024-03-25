"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Error {
    constructor(message, requestUuid) {
        this.message = message;
        this.requestUuid = requestUuid;
        this.getMessage = () => {
            return this.message;
        };
        this.getRequestUuid = () => {
            return this.requestUuid;
        };
        this.toString = () => {
            return JSON.stringify({
                type: 'error',
                message: this.message,
                uuid: this.requestUuid
            });
        };
    }
}
Error.fromString = (data) => {
    const parsed = JSON.parse(data);
    return new Error(parsed.message, parsed.uuid);
};
exports.default = Error;
