import { ApiResponse } from '@shared/api/responses';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const responseIsOk = (response: ApiResponse<any>) => {
  return response && response.statusCode && response.statusCode >= 200 && response.statusCode < 300;
};
