import { ApiResponse, User, Event } from '@shared/api/responses';
import { handleServerRequest } from '../apiClient';
import { UpdatePasswordPayload, UpdateWatchlistPayload, UserPayload } from '@shared/api/payloads';

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

export const addToWatchList = async (
  eventId: UpdateWatchlistPayload,
): Promise<ApiResponse<null>> => {
  return await handleServerRequest('UPDATE_WATCHLIST', eventId);
};

export const fetchUserWatchList = async (): Promise<ApiResponse<Event[]>> => {
  return await handleServerRequest('GET_WATCHLIST');
};
