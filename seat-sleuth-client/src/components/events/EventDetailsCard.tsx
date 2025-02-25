import { Card, Image, Text, Button, Group } from '@mantine/core';
import { EventData } from '@shared/api/external/eventData';
import { useNavigate } from 'react-router-dom';
import { seatGeekLogo, stubHubLogo, ticketMasterLogo } from '../../util/assetReconcileUtil';

export default function EventDetailsCard({ event }: { event: EventData }) {
  const navigate = useNavigate();
  const formattedName = encodeURIComponent(event.name).replace(/%20/g, '+');
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
          TicketMaster Range: ${event.priceMin} - ${event.priceMax || 'N/A'}
        </Text>
      )}

      {event.priceMin && event.priceMax && (
        <Text size="sm" mt="sm">
          StubHub Range: ${event.priceMin} - ${event.priceMax || 'N/A'}
        </Text>
      )}

      <Text size="sm" mt="sm">
        Sale Dates: {event.saleStart?.split('T')[0]} - {event.saleEnd?.split('T')[0]}
      </Text>

      <Group p={20} gap="10%">
        <Text c="white" size="lg" ml={20}>
          Comparing prices from...
        </Text>
        <Image src={ticketMasterLogo} alt="Ticketmaster logo" />
        <Button
          component="a"
          target="_blank"
          fullWidth
          mt="md"
          onClick={() => window.open(event.url, '_blank')}
        >
          View TicketMaster Event
        </Button>
        <Image src={stubHubLogo} alt="StubHub logo" />
        <Button
          component="a"
          target="_blank"
          fullWidth
          mt="md"
          onClick={() => {
            const url = `https://www.stubhub.com/secure/Search?q=${formattedName}&searchGuid=5E3D2F8A-ECCD-4FCB-9555-46D3569AF1AB`;
            window.open(url, '_blank');
          }}
        >
          View StubHub Event
        </Button>

        <Image src={seatGeekLogo} alt="SeakGeek logo" />
        <Button
          component="a"
          target="_blank"
          fullWidth
          mt="md"
          onClick={() => {
            const url = `https://www.vividseats.com/search?searchTerm=${event.name}`;
            window.open(url, '_blank');
          }}
        >
          View StubHub Event
        </Button>
      </Group>
    </Card>
  );
}
