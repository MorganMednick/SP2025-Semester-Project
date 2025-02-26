import {
  Container,
  Text,
  Image,
  Flex,
  Title,
  Group,
  Card,
  Anchor,
  Checkbox,
  Stack,
  Divider,
  NativeSelect,
} from '@mantine/core';
import { Event } from '@shared/api/responses';
import { TicketMasterSearchParams } from '@shared/api/external/ticketMaster';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { fetchTicketMasterEvents } from '../api/functions/ticketMaster';

export default function EventDetails() {
  const { id } = useParams();
  const { data: events } = useQuery<Event[], Error>(['ticketMasterEvents', id], async () => {
    const params: TicketMasterSearchParams = { id };
    const res = await fetchTicketMasterEvents(params);
    return res.data || [];
  });

  if (!events || events.length === 0) {
    return <Text ta="center">Event not found.</Text>;
  }

  const event = events[0];

  const formattedDate = new Date(event.startTime).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Container fluid w="100%" p={0} m={0}>
      {/* TODO: Replace with EventDetailsImageSection */}
      {event.imageSrc && event.name && (
        <Container fluid w="100%" p={0} m={0}>
          <Image src={event.imageSrc[0]} alt={event.name} height={400} width="100%" />

          <Flex justify="space-between" align="center">
            <Title c="white" order={1}>
              {event.name}
            </Title>
            <Checkbox
              color="green"
              iconColor="white"
              label="Watch price"
              labelPosition="left"
              c="white"
            />
          </Flex>
        </Container>
      )}

      {/* TODO: Replace with EventDetailsInfoSection */}
      <Flex direction={{ base: 'column', sm: 'row' }} align="center" gap="xl" mt="lg">
        {/* Location & Section Selectors */}
        <Stack gap="lg">
          <NativeSelect label="Location" size="md" data={['Option 1', 'Option 2']} w={300} />
          <NativeSelect label="Section" size="md" data={['Option A', 'Option B']} w={300} />
        </Stack>

        {/* Event Date */}
        <Text size="lg" tt="uppercase" ta="right">
          {formattedDate}
        </Text>

        {/* Vertical Divider */}
        <Divider size="lg" color="black" orientation="vertical" h={100} />

        {/* Venue Info */}
        <Stack gap="xs">
          <Text size="md" fw={700}>
            {event.city}
          </Text>
          <Text size="sm" tt="uppercase">
            {event.venueName}
            {event.venueSeatMapSrc && (
              <Anchor href={event.venueSeatMapSrc} target="_blank" size="sm" td="underline">
                See map
              </Anchor>
            )}
          </Text>
        </Stack>
      </Flex>

      {/* TODO: Replace with EventDetailsTicketCard */}
      <Flex justify="center" gap="xl" mt="lg">
        {event.priceMin && event.url && (
          <Card withBorder radius="md">
            <Text size="xxl" fw={700}>
              ${event.priceMin}
            </Text>
            <Group justify="center">
              <Anchor href={event.url || undefined} target="_blank" c="green.7" size="xl">
                TicketMaster
              </Anchor>
            </Group>
          </Card>
        )}
        <Card withBorder radius="md">
          <Text size="xxl" fw={700}>
            ${69.69}
          </Text>
          <Group justify="center">
            <Anchor href={event.url || undefined} target="_blank" c="orange" size="xl">
              SeatGeek
            </Anchor>
          </Group>
        </Card>
        <Card withBorder radius="md">
          <Text size="xxl" fw={700}>
            ${69.69}
          </Text>
          <Group justify="center">
            <Anchor href={event.url || undefined} target="_blank" c="purple" size="xl">
              StubHub
            </Anchor>
          </Group>
        </Card>
      </Flex>
    </Container>
  );
}
