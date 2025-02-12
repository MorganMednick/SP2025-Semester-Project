import {  handlleTicketMasterRequest } from '../apiClient';

export const requestTicketMaster = async () => {
  return handlleTicketMasterRequest('TM_REQUEST');
};
