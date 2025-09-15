export default class HttpError extends Error {
  public readonly status: number;
  public readonly body: unknown;

  constructor(status: number, body: unknown) {
    super();
    this.status = status;
    this.body = body;
    this.name = "HttpError";
  }

  get message(): string {
    return JSON.stringify({ status: this.status, body: this.body }, undefined, 2);
  }
}
