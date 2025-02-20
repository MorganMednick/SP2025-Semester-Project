import { ApiResponse } from "@shared/api/responses";
import { handleServerRequest } from "../apiClient";


export const getUserInfo = async (): Promise<ApiResponse<any>> => {
    return await handleServerRequest('GET_USER_INFO');
};