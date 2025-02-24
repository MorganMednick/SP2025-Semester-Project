import { Card, Image, Text, Button } from '@mantine/core';
import { EventData } from '@shared/api/external/eventData';
import { Link } from 'react-router-dom';

export default function EventCard({ event }: { event: EventData }) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section>
        <Image
          src={event.image || 'https://via.placeholder.com/300'}
          height={160}
          alt={event.event_name}
        />
      </Card.Section>
      <Text size="xs" mt="md">
        {event.id}
      </Text>
      <Text size="lg" mt="md">
        {event.event_name}
      </Text>
      <Text size="sm" c="dimmed">
        {event.event_location || 'Location TBD'}
      </Text>
      <Text size="sm" c="dimmed">
        {event.start_time}
      </Text>

      {event.price_min && (
        <Text size="sm" mt="sm">
          Ticket Range: ${event.price_min} - ${event.price_max || 'N/A'}
        </Text>
      )}

      <Link to={`/events/${event.id}`}>
        <Button component="a" href={event.tm_link} target="_blank" fullWidth mt="md">
          View Event Details
        </Button>
      </Link>
    </Card>
  );
}
