import { SpecificEventData } from '@shared/api/responses';

export type SingleEventData = SpecificEventData & { coverImage: string }; // Pull in coverImage from metadata
