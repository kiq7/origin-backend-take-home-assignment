export class InvalidUsecaseInputError extends Error {
  public readonly data: Record<string, unknown> | undefined;

  constructor(overrideMessage?: string, data?: Record<string, unknown>) {
    super();

    this.name = this.constructor.name;
    this.data = data;
    this.message = overrideMessage;

    Error.captureStackTrace(this, this.constructor);
  }
}
