import { Card, Image, Text, Button, Stack } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { Event } from '@shared/api/responses';

export default function EventCard({ event }: { event: Event }) {
  const navigate = useNavigate();

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      w="100%"
      onClick={() => navigate(`/events/${event.id}`)}
      style={{ cursor: 'pointer' }}
    >
      <Stack justify="space-between">
        <Card.Section>
          <Image
            src={event?.imageSrc?.[0] || 'https://via.placeholder.com/300'}
            height={160}
            alt={event.name}
          />
        </Card.Section>
        <Text size="lg" mt="md" lineClamp={1}>
          {event.name}
        </Text>
        <Text size="sm" c="dimmed">
          {event.venueName || 'Location TBD'}
        </Text>
        <Text size="sm" c="dimmed">
          {event.startTime}
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
      </Stack>
    </Card>
  );
}
