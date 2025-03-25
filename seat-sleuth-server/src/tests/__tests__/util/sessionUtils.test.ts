import { Request, Response } from 'express';
import { destroySessionAndClearCookies } from '../../../util/sessionUtils';
import { sendError, sendSuccess } from '../../../util/responseUtils';
import { StatusCodes } from 'http-status-codes';
import { error } from 'console';

jest.mock('../../../util/responseUtils', () => ({
  sendError: jest.fn(),
  sendSuccess: jest.fn(),
}));

describe('Session Utils', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockRequest = {
      session: {
        destroy: jest.fn(),
      } as any,
    };

    mockResponse = {
      clearCookie: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should destroy session and clear cookies on successful logout', () => {
    (mockRequest.session!.destroy as jest.Mock).mockImplementation((callback) => callback(null));

    destroySessionAndClearCookies(mockRequest as Request, mockResponse as Response);

    expect(mockRequest.session!.destroy).toHaveBeenCalled();

    expect(mockResponse.clearCookie).toHaveBeenCalledWith('connect.sid', { path: '/' });

    expect(sendSuccess).toHaveBeenCalledWith(mockResponse, {
      statusCode: StatusCodes.OK,
      message: 'Logout successful',
    });
  });

  it('should handle error during session destruction', () => {
    const mockError = new Error('Session destruction failed');

    (mockRequest.session!.destroy as jest.Mock).mockImplementation((callback) =>
      callback(mockError),
    );

    destroySessionAndClearCookies(mockRequest as Request, mockResponse as Response);

    expect(mockRequest.session!.destroy).toHaveBeenCalled();

    expect(sendError).toHaveBeenCalledWith(mockResponse, {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Error logging out',
      error: mockError,
    });

    expect(mockResponse.clearCookie).not.toHaveBeenCalled();
  });

  it('should handle case where no session exists', () => {
    mockRequest.session = undefined;

    destroySessionAndClearCookies(mockRequest as Request, mockResponse as Response);

    expect(sendError).toHaveBeenCalledWith(mockResponse, {
      statusCode: StatusCodes.UNAUTHORIZED,
      message: 'User not logged in',
      error: null,
    });

    expect(mockResponse.clearCookie).toHaveBeenCalledWith('connect.sid', { path: '/' });
  });
});
