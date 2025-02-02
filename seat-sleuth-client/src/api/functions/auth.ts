import { AuthPayload } from "@shared/api/payloads";
import { handleServerRequest } from "../apiClient";
import {
  ApiResponse,
  LoginResponse,
  RegistrationResponse,
} from "@shared/api/responses";

export const registerUser = async (
  user: AuthPayload,
): Promise<ApiResponse<RegistrationResponse>> => {
  return await handleServerRequest("AUTH_REGISTER", user);
};

export const loginUser = async (
  user: AuthPayload,
): Promise<ApiResponse<LoginResponse>> => {
  return await handleServerRequest("AUTH_LOGIN", user);
};
