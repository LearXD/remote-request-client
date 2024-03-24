export default class Request {
    private url;
    private options;
    private target;
    private uuid;
    constructor(url: string, options: RequestInit, target: string, uuid?: string);
    execute(): Promise<string>;
    static fromString(data: string): Request;
    getUuid(): string;
    getTarget(): string;
    toString(): string;
}
