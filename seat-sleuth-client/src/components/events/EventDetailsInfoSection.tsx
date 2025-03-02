import { Flex, Stack, Text, Anchor, NativeSelect, Divider } from '@mantine/core';
import { useQuery } from 'react-query';
import { useMemo } from 'react';
import { Event } from '@shared/api/responses';
import { fetchTicketMasterEvents } from '../../api/functions/ticketMaster';
import { useNavigate } from 'react-router-dom';

interface InfoProps {
  event: Event;
  setEvent: React.Dispatch<React.SetStateAction<Event>>;
}

export default function EventDetailsInfoSection({ event, setEvent }: InfoProps) {
  const navigate = useNavigate();

  const formattedDate = useMemo(
    () =>
      new Date(event.startTime).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    [event.startTime],
  );

  const { data: otherLocationsForEvent = [] } = useQuery<Event[], Error>(
    ['eventsWithSameLocation', event.name],
    async () => {
      const res = await fetchTicketMasterEvents({ keyword: event.name });
      return res?.data?.filter((other) => other.name === event.name) || [];
    },
    { enabled: !!event.name },
  );

  const locationOptions = useMemo(
    () =>
      otherLocationsForEvent.length
        ? otherLocationsForEvent.map((evt) => ({
            value: evt.id,
            label: evt.venueName || 'Unknown Location',
          }))
        : [{ value: '', label: 'Fetching Locations...' }],
    [otherLocationsForEvent],
  );

  const handleLocationChange = (selectedEventId: string) => {
    const selectedEvent = otherLocationsForEvent.find((evt) => evt.id === selectedEventId);
    if (selectedEvent) setEvent(selectedEvent);
    navigate(`/events/${selectedEvent?.id}`);
  };

  return (
    <Flex direction={{ base: 'column', sm: 'row' }} align="center" mt="s" pl={50}>
      <Stack gap="xl" mt={20}>
        <NativeSelect
          label="Location"
          size="md"
          c="green.7"
          data={locationOptions}
          value={event.id || ''}
          w={400}
          h={60}
          labelProps={{ style: { fontWeight: 'bold' } }}
          onChange={(e) => handleLocationChange(e.target.value)}
        />

        <NativeSelect
          label="Section"
          size="md"
          c="green.7"
          data={['Option A', 'Option B']}
          w={400}
          h={60}
          labelProps={{ style: { fontWeight: 'bold' } }}
        />
      </Stack>

      <Flex direction="row" align="center" ml="auto" pr={350} gap="xl" mt={-10}>
        <Stack align="flex-end" gap="xs">
          <Text size="x" tt="uppercase" ta="left">
            {formattedDate}
          </Text>
        </Stack>

        <Divider size="lg" color="black" orientation="vertical" h={100} />

        <Stack align="flex-start" gap={5}>
          <Text size="xxl" fw={700} ta="left">
            {event.city}
          </Text>
          <Text size="xl" tt="uppercase" ta="left">
            {event.venueName}
          </Text>
          {event.venueSeatMapSrc && (
            <Anchor href={event.venueSeatMapSrc} target="_blank" size="xl" td="underline">
              See map
            </Anchor>
          )}
        </Stack>
      </Flex>
    </Flex>
  );
}
