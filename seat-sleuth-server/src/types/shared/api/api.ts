import { MERGED_API_SCHEMA, HttpMethodsAllowed, ValidServerEndpoints } from './apiSchema';

export const API_ENDPOINTS: Record<
  ValidServerEndpoints,
  { route: string; method: HttpMethodsAllowed }
> = Object.fromEntries(
  Object.entries(MERGED_API_SCHEMA).map(([key, { route, method }]) => [key, { route, method }]),
) as Record<ValidServerEndpoints, { route: string; method: HttpMethodsAllowed }>;
