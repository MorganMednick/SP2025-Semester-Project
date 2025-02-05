import { sendSuccess, sendError } from '../../../util/responseUtils';
import { Response } from 'express';

describe('Response Utils', () => {
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should send a success response with the correct structure', () => {
    const mockData = { user: 'Jayce' };
    const mockMessage = 'Success!';
    const mockStatus = 200;

    sendSuccess(mockResponse as Response, {
      statusCode: mockStatus,
      message: mockMessage,
      data: mockData,
    });

    expect(mockResponse.status).toHaveBeenCalledWith(mockStatus);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: true,
      statusCode: mockStatus,
      message: mockMessage,
      data: mockData,
    });
  });

  it('should send an error response with the correct structure', () => {
    const mockMessage = 'Something went wrong';
    const mockStatus = 500;
    const mockError = new Error('Test error');

    sendError(mockResponse as Response, {
      statusCode: mockStatus,
      message: mockMessage,
      error: mockError,
    });

    expect(mockResponse.status).toHaveBeenCalledWith(mockStatus);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      statusCode: mockStatus,
      message: mockMessage,
      error: mockError.message,
    });
  });

  it('should handle undefined error gracefully', () => {
    sendError(mockResponse as Response, {
      statusCode: 400,
      message: 'Bad Request',
      error: null,
    });

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      statusCode: 400,
      message: 'Bad Request',
      error: 'Unknown error',
    });
  });
});
