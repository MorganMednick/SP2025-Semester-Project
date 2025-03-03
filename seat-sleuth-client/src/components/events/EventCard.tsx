import { Card, Image, Text, Button, Stack } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { Event } from '@shared/api/responses';
import { useState } from 'react';
import axios from 'axios'; // Ensure axios is installed

export default function EventCard({ event }: { event: Event }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>('');

  const sendPriceDropEmail = async () => {
    setLoading(true);

    try {
      const userEmail = 'mmednick25@gmail.com'; // TODO: Replace with the actual user's email

      const response = await axios.post('/api/email/send-price-alert', {
        userEmail,
        ticketName: event.name,
        ticketPrice: event.priceMin,
      });

      setMessage('✅ Email sent successfully!');
    } catch (error) {
      setMessage('❌ Failed to send email.');
      console.error('Error sending email:', error);
    } finally {
      setLoading(false);
    }
  };

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

        <Button fullWidth mt="md" color="green" onClick={sendPriceDropEmail} disabled={loading}>
          {loading ? 'Sending...' : 'Notify Me of Price Drop'}
        </Button>

        {message && <Text mt="sm">{message}</Text>}
      </Stack>
    </Card>
  );
}
