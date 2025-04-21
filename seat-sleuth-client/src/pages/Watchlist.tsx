import { useQuery } from 'react-query';
import PageLayout from '../components/layout/PageLayout';
import { Title } from '@mantine/core';
import { SpecificEventData } from '@client/types/shared/responses';
import { fetchUserWatchList } from '../api/functions/watchlist';
import WatchlistGrid from '@/components/watchlist/WatchlistGrid';

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
      <Title order={1} pl={75} pb={45}>
        {isLoading ? 'Fetching User Watchlist...' : 'WATCHLIST'}
      </Title>
      <WatchlistGrid events={watchlistData} isError={isError} isLoading={isLoading} error={error} />
    </PageLayout>
  );
}
