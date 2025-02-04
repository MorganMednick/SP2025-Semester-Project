import { AuthPayload } from './payloads';
import { LoginResponse, RegistrationResponse } from './responses';

export type ValidPayloads = AuthPayload;
export type ValidApiResponses = LoginResponse | RegistrationResponse;
