import { handleServerRequest } from '../apiClient';

export const retrieveServerHealth = async () => {
  return handleServerRequest('HEALTH');
};
