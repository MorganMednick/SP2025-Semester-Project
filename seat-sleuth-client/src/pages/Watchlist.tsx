import { useQuery } from 'react-query';
import PageLayout from '../components/layout/PageLayout';
import { Text } from '@mantine/core';
import { SpecificEventData } from '@client/types/shared/responses';
import { fetchUserWatchList } from '../api/functions/watchlist';
import WatchlistGrid from '@/components/events/WatchlistGrid';

export default function Watchlist() {
  const {
    data: watchlistData,
    isLoading,
    isError,
    error,
  } = useQuery<SpecificEventData[], Error>('eventWithOptions', async () => {
    const res = await fetchUserWatchList();
    return res?.data || [];
  });

  return (
    <PageLayout>
      <Text>{isLoading ? 'Fetching User Watchlist...' : 'Your Watchlist'}</Text>
      <WatchlistGrid events={watchlistData} isError={isError} isLoading={isLoading} error={error} />
    </PageLayout>
  );
}
