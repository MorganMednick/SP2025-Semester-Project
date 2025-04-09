import { SpecificEventData } from '@client/types/shared/responses';

export type SingleEventData = SpecificEventData & { coverImage: string }; // Pull in coverImage from metadata
