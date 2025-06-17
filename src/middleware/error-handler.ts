import type { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import type { ApiResponse } from '@/types';

/**
 * Global error handler middleware
 */
export async function errorHandler(
  error: Error,
  c: Context
): Promise<Response> {
  // Handle HTTP exceptions
  if (error instanceof HTTPException) {
    const response: ApiResponse = {
      status: 'error',
      message: error.message,
      error_type: 'http_error',
    };
    return c.json(response, error.status);
  }

  // Handle validation errors
  if (error.name === 'ZodError') {
    const response: ApiResponse = {
      status: 'error',
      message: 'Validation error',
      error_type: 'validation_error',
    };
    return c.json(response, 400);
  }

  // Handle generic errors
  const response: ApiResponse = {
    status: 'error',
    message: error.message || 'Internal server error',
    error_type: 'internal_error',
  };

  return c.json(response, 500);
}

/**
 * Create standardized error responses
 */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly errorType: string,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Common error factory functions
 */
export const createError = {
  badRequest: (message: string) => new ApiError(400, 'bad_request', message),
  unauthorized: (message: string) => new ApiError(401, 'unauthorized', message),
  forbidden: (message: string) => new ApiError(403, 'forbidden', message),
  notFound: (message: string) => new ApiError(404, 'not_found', message),
  unprocessableEntity: (message: string) =>
    new ApiError(422, 'unprocessable_entity', message),
  internalError: (message: string) =>
    new ApiError(500, 'internal_error', message),
}; 