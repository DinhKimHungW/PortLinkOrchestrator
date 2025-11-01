import { randomUUID } from 'crypto';

export class ApiError extends Error {
  constructor(status, error, details) {
    super(details || error);
    this.status = status;
    this.error = error;
    this.details = details;
    this.traceId = status >= 500 ? randomUUID() : undefined;
  }

  toJSON() {
    const payload = { error: this.error };
    if (this.details) payload.details = this.details;
    if (this.traceId) payload.traceId = this.traceId;
    return payload;
  }
}

export function badRequest(details) {
  return new ApiError(400, 'BadRequest', details);
}

export function unauthorized(details) {
  return new ApiError(401, 'Unauthorized', details);
}

export function forbidden(details) {
  return new ApiError(403, 'Forbidden', details);
}

export function notFound(details) {
  return new ApiError(404, 'NotFound', details);
}

export function conflict(details) {
  return new ApiError(409, 'Conflict', details);
}

export function internal(details) {
  return new ApiError(500, 'InternalServerError', details);
}
