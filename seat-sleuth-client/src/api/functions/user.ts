import { ApiResponse, User } from '../../../../seat-sleuth-server/src/types/shared/responses';
import { handleServerRequest } from '../apiClient';
import {
  UpdatePasswordPayload,
  UserPayload,
} from '../../../../seat-sleuth-server/src/types/shared/payloads';

export const getUserInfo = async (): Promise<ApiResponse<User>> => {
  return await handleServerRequest('GET_USER_INFO');
};

export const updateUserInfo = async (user: UserPayload): Promise<ApiResponse<null>> => {
  return await handleServerRequest('UPDATE_USER_INFO', user);
};

export const updatePassword = async (
  password: UpdatePasswordPayload,
): Promise<ApiResponse<null>> => {
  return await handleServerRequest('UPDATE_PASSWORD', password);
};
