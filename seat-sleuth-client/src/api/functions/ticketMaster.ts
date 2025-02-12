import {  handleTicketMasterRequest } from '../apiClient';

export const requestTicketMaster = async () => {
  return handleTicketMasterRequest('TM_REQUEST');
};
