import { SpecificEventData } from '../../../seat-sleuth-server/src/types/shared/responses';

export type SingleEventData = SpecificEventData & { coverImage: string }; // Pull in coverImage from metadata
