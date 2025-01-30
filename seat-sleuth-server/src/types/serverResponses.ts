import { StatusCodes } from 'http-status-codes';
export type ControllerResult = ServerSuccessResponse | ServerErrorResponse;

export type ServerSuccessResponse = {
  success: true;
  statusCode: StatusCodes;
  message: string;
  data?: any;
};

export type ServerErrorResponse = {
  success: false;
  statusCode: StatusCodes;
  message: string;
  error?: any;
};
