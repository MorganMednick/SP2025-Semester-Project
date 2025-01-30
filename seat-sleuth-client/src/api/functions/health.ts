import { handleServerRequest } from '../apiClient';

export const retrieveServerHealth = async () => {
  return await handleServerRequest('HEALTH');
};
