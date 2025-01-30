import { AuthPayload } from './payloads';
import { LoginResponse, RegistrationResponse } from './responses';

export type ValidServerEndpoints = 'HEALTH' | 'AUTH_LOGIN' | 'AUTH_REGISTER';
export type ValidPayloads = AuthPayload;
export type ValidApiResponses = LoginResponse | RegistrationResponse;
