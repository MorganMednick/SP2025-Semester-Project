import { useQuery } from 'react-query';
import { ApiResponse, UserWatchListEntry } from '@shared/api/responses';
import EventCardGrid from '../components/events/EventCardGrid';
import PageLayout from '../components/layout/PageLayout';
import { fetchUserWatchList } from '../api/functions/watchlist';
import { Text } from '@mantine/core';

export default function Watchlist() {
  const {
    data: watchlist,
    isLoading,
    isError,
    error,
  } = useQuery<UserWatchListEntry[], Error>(['userWatchlist'], async () => {
    const res: ApiResponse<UserWatchListEntry[]> = await fetchUserWatchList();
    return res?.data || [];
  });

  return (
    <PageLayout>
      <Text>WatchList</Text>
      <EventCardGrid
        events={watchlist?.map((watched) => watched.event) || []}
        isLoading={isLoading}
        isError={isError}
        error={error}
      />
    </PageLayout>
  );
}
