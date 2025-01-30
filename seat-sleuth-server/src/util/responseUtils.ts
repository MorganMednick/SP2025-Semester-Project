import { ServerErrorResponse, ServerSuccessResponse } from '../types/serverResponses';
import { Response } from 'express';

/**
 * Sends a structured success response back to the client.
 *
 * @template T - The type of the data being sent in the response.
 * @param res - The Express `Response` object used to send the response.
 * @param options - An object containing:
 *   - `statusCode`: The HTTP status code for the response.
 *   - `message`: A message describing the response.
 *   - `data` (optional): The payload to be sent in the response.
 */
export const sendSuccess = <T>(res: Response, { statusCode, message, data }: Omit<ServerSuccessResponse, 'success'>) => {
  res.status(statusCode).json({ success: true, statusCode, message, data });
};

/**
 * Sends a structured error response back to the client.
 *
 * @param res - The Express `Response` object used to send the response.
 * @param options - An object containing:
 *   - `statusCode`: The HTTP status code for the response.
 *   - `message`: A message describing the error.
 *   - `error` (optional): Additional error details, if any.
 * @returns The formatted error response sent to the client.
 */
export const sendError = (res: Response, { statusCode, message, error }: Omit<ServerErrorResponse, 'success'>) => {
  res.status(statusCode).json({ success: false, statusCode, message, error });
};
