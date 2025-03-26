import { ApiResponse, GetWatchlistForUserResponse } from '@shared/api/responses';
import { handleServerRequest } from '../apiClient';
import {
  AddToWatchListPayload,
  IsUserWatchingPayload,
  RemoveFromWatchListPayload,
} from '@shared/api/payloads';

export const addToWatchList = async (
  addToWatchListPayload: AddToWatchListPayload,
): Promise<ApiResponse<null>> => {
  return await handleServerRequest('ADD_TO_WATCHLIST', addToWatchListPayload);
};

export const removeFromWatchList = async (
  removeFromWatchListPayload: RemoveFromWatchListPayload,
): Promise<ApiResponse<null>> => {
  return await handleServerRequest('REMOVE_FROM_WATCHLIST', removeFromWatchListPayload);
};

export const fetchUserWatchList = async (): Promise<ApiResponse<GetWatchlistForUserResponse>> => {
  return await handleServerRequest('GET_WATCHLIST');
};

export const checkIfUserIsWatchingParticularEventInstance = async (
  isUserWatchingPayload: IsUserWatchingPayload,
): Promise<ApiResponse<null>> => {
  return await handleServerRequest('CHECK_IF_USER_WATCHING', isUserWatchingPayload);
};
