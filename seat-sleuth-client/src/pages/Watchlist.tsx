import { useQuery } from 'react-query';
import { ApiResponse, EventOptionData } from '@shared/api/responses';
import PageLayout from '../components/layout/PageLayout';
import { fetchUserWatchList } from '../api/functions/watchlist';
import { Text } from '@mantine/core';

export default function Watchlist() {
  const {
    data: watchlist,
    isLoading,
  } = useQuery<EventOptionData[], Error>(['userWatchlist'], async () => {
    const res: ApiResponse<EventOptionData[]> = await fetchUserWatchList();
    return res?.data || [];
  });

  return (
    <PageLayout>
      <Text>WatchList</Text>
      {/* TODO - Streamline data for watchlist...  */}
      {!isLoading && JSON.stringify(watchlist)}
    </PageLayout>
  );
}
