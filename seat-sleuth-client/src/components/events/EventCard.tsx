import { Card, Image, Text, Button } from '@mantine/core';
import { EventData } from '@shared/api/external/eventData';
import { useNavigate } from 'react-router-dom';
import { showMantineNotification } from '../../util/uiUtils';
import { addToWatchList } from '../../api/functions/user';

export default function EventCard({ event }: { event: EventData }) {
  const navigate = useNavigate();

  const watchEvent = async (eventId: string) => {
    try {
      await addToWatchList({ eventId });
      showMantineNotification({ message: 'Event added to watchlist!', type: 'SUCCESS' });
    } catch (err) {
      console.error(err);
      showMantineNotification({ message: 'Failed to add event to watchlist!', type: 'ERROR' });
    }
  };
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section>
        <Image
          src={event?.imageSrc?.[0] || 'https://via.placeholder.com/300'}
          height={160}
          alt={event.name}
        />
      </Card.Section>

      <Text size="lg" mt="md">
        {event.name}
      </Text>
      <Text size="sm" c="dimmed">
        {event.venueName || 'Location TBD'}
      </Text>
      <Text size="sm" c="dimmed">
        {event.startTime}
      </Text>

      {event.priceMin && event.priceMax && (
        <Text size="sm" mt="sm">
          Ticket Range: ${event.priceMin} - ${event.priceMax || 'N/A'}
        </Text>
      )}

      <Text size="sm" mt="sm">
        Sale Dates: {event.saleStart?.split('T')[0]} - {event.saleEnd?.split('T')[0]}
      </Text>

      <Button
        component="a"
        target="_blank"
        fullWidth
        mt="md"
        onClick={() => navigate(`/events/${event.id}`)}
      >
        View Event Details
      </Button>

      <Button component="a" target="_blank" fullWidth mt="md" onClick={() => watchEvent(event.id)}>
        Add to WatchList
      </Button>
    </Card>
  );
}
