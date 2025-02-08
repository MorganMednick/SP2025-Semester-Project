import { AuthPayload } from '@shared/api/payloads';
import { handleServerRequest } from '../apiClient';
import { ApiResponse, AuthResponse } from '@shared/api/responses';

export const registerUser = async (user: AuthPayload): Promise<ApiResponse<AuthResponse>> => {
  return await handleServerRequest('AUTH_REGISTER', user);
};

export const loginUser = async (user: AuthPayload): Promise<ApiResponse<AuthResponse>> => {
  return await handleServerRequest('AUTH_LOGIN', user);
};

export const checkLogin = async (): Promise<ApiResponse<AuthResponse>> => {
  return await handleServerRequest('CHECK_LOGIN');
};

export const logoutUser = async (): Promise<ApiResponse<AuthResponse>> => {
  return await handleServerRequest('AUTH_LOGOUT');
};
