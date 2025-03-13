import { Card, Image, Text, Button, Stack } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { Event } from '@shared/api/responses';
import { useState } from 'react';
// import axios from 'axios'; // Ensure axios is installed
import { EmailNotificationPayload } from '@shared/api/payloads';
import { useQuery } from 'react-query';
import { sendPriceDropEmail } from '../../api/functions/email';

export default function EventCard({ event }: { event: Event }) {
  const navigate = useNavigate();
  const [message, setMessage] = useState<string>('');

  const userEmail: string = 'mmednick25@gmail.com';

  const emailParams: EmailNotificationPayload = {
    email: userEmail,
    ticketName: event.name,
    ticketPrice: event.priceMin,
  };

  // UseQuery setup
  const { refetch, isFetching } = useQuery({
    queryKey: ['sendEmail', emailParams],
    queryFn: () => sendPriceDropEmail(emailParams),
    enabled: false, // Don't run on mount, only on demand
    retry: false,
    onSuccess: () => setMessage('✅ Email sent successfully!'),
    onError: () => setMessage('❌ Failed to send email.'),
  });

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      w="100%"
      //onClick={() => navigate(`/events/${event.id}`)}
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

        <Button fullWidth mt="md" color="green" onClick={() => refetch()} disabled={isFetching}>
          {isFetching ? 'Sending...' : 'Notify Me of Price Drop'}
        </Button>

        {message && <Text mt="sm">{message}</Text>}
      </Stack>
    </Card>
  );
}
