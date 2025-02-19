import { Card, Image, Text, Button } from '@mantine/core';
import { EventData } from '@shared/api/external/eventData';

export default function EventCard({ event }: { event: EventData }) {
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

      {/* Point to TM for now */}
      <Button component="a" href={event.url} target="_blank" fullWidth mt="md">
        View Event Details
      </Button>
    </Card>
  );
}
