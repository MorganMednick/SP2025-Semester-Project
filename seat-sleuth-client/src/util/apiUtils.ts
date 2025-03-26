import { ApiResponse, EventData, EventMetaData } from '@shared/api/responses';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const responseIsOk = (response: ApiResponse<any>): boolean => {
  return !!(
    response &&
    typeof response.statusCode === 'number' &&
    response.statusCode >= 200 &&
    response.statusCode < 300
  );
};

export const stripInstancesFromEventData = (events: EventData[]): EventMetaData[] | [] => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return events.map(({ instances, ...rest }) => rest) || [];
};
