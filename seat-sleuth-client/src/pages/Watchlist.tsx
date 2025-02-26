import { useQuery } from 'react-query';
import { fetchUserWatchList } from '../api/functions/user';
import { Event } from '@shared/api/responses';

export default function Watchlist() {
  const {
    data: events = [],
    isLoading,
    isError,
    error,
  } = useQuery<Event[], Error>(['userWatchlist'], async () => {
    const res = await fetchUserWatchList();
    return res?.data || [];
  });

  if (isLoading) return <div>Loading watchlist...</div>;
  if (isError) return <div>Error loading watchlist: {error.message}</div>;

  return (
    <div>
      {events.length > 0 ? (
        <pre>{JSON.stringify(events, null, 2)}</pre>
      ) : (
        <p>No events in your watchlist.</p>
      )}
    </div>
  );
}
