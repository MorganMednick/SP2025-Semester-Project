import { Flex, Stack, Text, NativeSelect, Divider, Anchor } from '@mantine/core';
import {  EventData, SpecificEventData} from '@shared/api/responses';
import { useNavigate } from 'react-router-dom';

export default function EventDetailsInfoSection({eventData} : EventData) {
  const navigate = useNavigate();
  const options = eventData.options;
  const otherLocationsForEvent: string[] = eventData.options.map((option: SpecificEventData) => );

  const handleLocationChange = (selectedEventId: string) => {
    const selectedEvent = otherLocationsForEvent.find((evt) => evt.id === selectedEventId);
    if (selectedEvent) setSelectedOption(selectedEvent);
    navigate(`/events/${selectedEvent?.id}`);
  };

  return (
    <Flex direction={{ base: 'column', sm: 'row' }} align="center" mt="s" pl={50}>
      <Stack gap="xl" mt={20}>
        <NativeSelect
          label="Location"
          size="md"
          c="green.7"
          data={otherLocationsForEvent}
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
            {selectedOption.event.eventName}
          </Text>
        </Stack>

        <Divider size="lg" color="black" orientation="vertical" h={100} />

        <Stack align="flex-start" gap={5}>
          <Text size="xxl" fw={700} ta="left">
            {selectedOption.event.date}
          </Text>
          <Text size="xl" tt="uppercase" ta="left">
            {selectedOption.event.venueName}
          </Text>
          {selectedOption.venueSeatMapSrc && (
            <Anchor href={selectedOption.venueSeatMapSrc} target="_blank" size="xl" td="underline">
              See map
            </Anchor>
          )}
        </Stack>
      </Flex>
    </Flex>
  );
}
