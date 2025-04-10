import {
  AddToWatchListPayload,
  RemoveFromWatchListPayload,
  IsUserWatchingPayload,
} from '@client/types/shared/payloads';
import { ApiResponse, EventData } from '@client/types/shared/responses';
import { handleServerRequest } from '../apiClient';

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

export const fetchUserWatchList = async (): Promise<ApiResponse<EventData[]>> => {
  return await handleServerRequest('GET_WATCHLIST');
};

export const checkIfUserIsWatchingParticularEventInstance = async (
  isUserWatchingPayload: IsUserWatchingPayload,
): Promise<ApiResponse<null>> => {
  return await handleServerRequest('CHECK_IF_USER_WATCHING', isUserWatchingPayload);
};
