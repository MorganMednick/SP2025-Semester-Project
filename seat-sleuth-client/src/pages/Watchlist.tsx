import { useQuery } from 'react-query';
import { fetchUserWatchList } from '../api/functions/user';
import { Event } from '@shared/api/responses';
import { Container } from '@mantine/core';
import EventCardGrid from '../components/events/EventCardGrid';
import PageLayout from '../components/layout/PageLayout';

export default function Watchlist() {
  const {
    data: watchlist,
    isLoading,
    isError,
    error,
  } = useQuery<Event[], Error>(['userWatchlist'], async () => {
    const res = await fetchUserWatchList();
    return res?.data || [];
  });

  return (
    <PageLayout>
      <EventCardGrid
        events={watchlist || []}
        isLoading={isLoading}
        isError={isError}
        error={error}
      />
    </PageLayout>
  );
}
