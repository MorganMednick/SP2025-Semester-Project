import { useQuery } from 'react-query';
import PageLayout from '../components/layout/PageLayout';
import { Text } from '@mantine/core';
import { EventMetaData, GetWatchlistForUserResponse } from '@shared/api/responses';
import { fetchUserWatchList } from '../api/functions/watchlist';
import EventCardGrid from '../components/events/EventCardGrid';
import { stripInstancesFromEventData } from '../util/apiUtils';

export default function Watchlist() {
  const {
    data: watchlistData,
    isLoading,
    isError,
    error,
  } = useQuery<EventMetaData[], Error>('eventWithOptions', async () => {
    const res = await fetchUserWatchList();
    const eventData: GetWatchlistForUserResponse = res?.data || [];
    return stripInstancesFromEventData(eventData);
  });

  return (
    <PageLayout>
      <Text>{isLoading ? 'Fetching User Watchlist...' : 'Your Watchlist'}</Text>
      <EventCardGrid events={watchlistData} isError={isError} isLoading={isLoading} error={error} />
    </PageLayout>
  );
}
