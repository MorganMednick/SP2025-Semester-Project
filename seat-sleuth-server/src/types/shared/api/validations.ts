import { AuthPayload } from './payloads';
import { AuthResponse, Event } from './responses';

export type ValidPayloads = AuthPayload;
export type ValidApiResponses = AuthResponse | Event[];
