export class ServiceError extends Error {
  constructor(
    message: string,
    public readonly status: number = 500,
    public readonly code?: string
  ) {
    super(message);
    this.name = "ServiceError";
  }
}

export function toErrorResponse(error: unknown) {
  if (error instanceof ServiceError) {
    return { error: error.message, code: error.code, status: error.status };
  }
  console.error(error);
  return { error: "Internal server error", status: 500 };
}
