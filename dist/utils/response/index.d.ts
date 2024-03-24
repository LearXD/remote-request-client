export default class Response {
    private uuid;
    private data;
    constructor(uuid: string, data: any);
    getUuid(): string;
    getData(): any;
    static fromString(payload: string): Response;
    toString(): string;
}
