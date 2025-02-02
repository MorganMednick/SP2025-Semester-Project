import { Response } from 'express';
import { ApiResponse } from '../types/shared/api/responses';

/**
 * Sends a structured success response back to the client.
 *
 * @template T - The type of the data being sent in the response.
 * @param res - The Express `Response` object used to send the response.
 * @param options - The response details, including status, message, and optional data.
 */
export const sendSuccess = <T>(
  res: Response,
  { statusCode, data, message }: ApiResponse<T>
) => {
  return res
    .status(statusCode)
    .json({ success: true, statusCode, message, data });
};

/**
 * Sends a structured error response back to the client.
 *
 * @param res - The Express `Response` object used to send the response.
 * @param options - The response details, including status, message, and optional error data.
 */
export const sendError = (
  res: Response,
  { statusCode, message, error }: ApiResponse<null>
) => {
  return res
    .status(statusCode)
    .json({ success: false, statusCode, message, error });
};
