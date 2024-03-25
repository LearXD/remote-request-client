export default class Error {
    private message;
    private requestUuid;
    constructor(message: string, requestUuid: string);
    getMessage: () => string;
    getRequestUuid: () => string;
    static fromString: (data: string) => Error;
    toString: () => string;
}
