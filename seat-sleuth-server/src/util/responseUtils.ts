import { Response } from 'express';
import { ApiErrorResponse, ApiSuccessResponse } from '../types/shared/api/responses';

/**
 * Sends a structured success response back to the client.
 *
 * @template T - The type of the data being sent in the response.
 * @param res - The Express `Response` object used to send the response.
 * @param options - The response details, including status, message, and optional data.
 */
export const sendSuccess = <T>(res: Response, { statusCode, data, message }: ApiSuccessResponse<T>) => {
  return res.status(statusCode).json({ success: true, statusCode, message, data });
};

/**
 * Sends a structured error response back to the client.
 *
 * @param res - The Express `Response` object used to send the response.
 * @param options - The response details, including status, message, and optional error data.
 */
export const sendError = (res: Response, { statusCode, message, error }: ApiErrorResponse<null>) => {
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    error: typeof error === 'object' ? (error?.message ?? 'Unknown error') : error,
  });
};
