import {  handlleTicketMasterRequest } from '../apiClient';

export const requestTicketMaster = async () => {
  return handlleTicketMasterRequest('TM_REQUEST');
};
//Build routes then wrapper for these. we're gonna have to go change the api request on the backend. TM_REQUEST

//Make a new apiClient for TM w/different base url
