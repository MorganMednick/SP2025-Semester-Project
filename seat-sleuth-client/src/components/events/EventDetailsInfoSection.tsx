import { Flex, NativeSelect, Stack, Anchor, Divider, Text, Group, Grid } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { EventData } from '@shared/api/responses';
import { useEffect, useState } from 'react';
import EventPriceOption from './EventPriceOption';

interface EventDetailsInfoSectionProps {
  event?: EventData | null;
  isLoading: boolean;
  isError: boolean;
}

export default function EventDetailsInfoSection({
  event,
  isLoading,
  isError,
}: EventDetailsInfoSectionProps) {
  const isSmallScreen = useMediaQuery('(max-width: 1350px)');

  const [selectedOption, setSelectedOption] = useState(event?.instances?.[0] || null);

  useEffect(() => {
    if (event?.instances?.length) {
      setSelectedOption(event.instances[0]);
    }
  }, [event]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading event details</div>;
  if (!event) return null;

  const options = event.instances || [];
  const otherLocationsForEvent = options.map((instance) => ({
    label: `${instance.venueName || 'Unknown Venue'} - ${instance.city || 'Unknown City'}, ${instance.country || 'Unknown Country'}`,
    value: instance.ticketMasterId,
  }));

  const handleLocationChange = (selectedEventId: string) => {
    const selectedEvent = options.find((evt) => evt.ticketMasterId === selectedEventId);
    if (selectedEvent) setSelectedOption(selectedEvent);
  };

  const formattedDate = selectedOption
    ? new Date(selectedOption.startTime).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return (
    <Stack justify="center" gap="xs">
      <Flex
        direction={isSmallScreen ? 'column' : 'row'}
        justify="space-between"
        align="flex-start"
        gap="xs"
      >
        <Stack w={isSmallScreen ? '100%' : '50%'} pt={5}>
          <Group align="center">
            <Text size="xl" tt="uppercase">
              {formattedDate || 'Unknown Date'}
            </Text>
            <Divider size="lg" color="black" orientation="vertical" h={100} />
            <Stack gap={2}>
              <Text size="xxl" fw={700}>
                {selectedOption?.city || 'Unknown City'}
              </Text>
              <Flex align="center">
                <Text size="xl" tt="uppercase">
                  {selectedOption?.venueName || 'Unknown Venue'}
                </Text>
                {selectedOption?.seatMapSrc && (
                  <Anchor href={selectedOption.seatMapSrc} target="_blank" size="md" pl={5}>
                    See map
                  </Anchor>
                )}
              </Flex>
            </Stack>
          </Group>

          {/* Location Selector */}
          {otherLocationsForEvent.length > 0 && (
            <NativeSelect
              label="Location"
              size="md"
              data={otherLocationsForEvent}
              value={selectedOption?.ticketMasterId || ''}
              onChange={(e) => handleLocationChange(e.target.value)}
              w="100%"
              h={50}
              labelProps={{ style: { fontWeight: 'bold' } }}
            />
          )}
        </Stack>

        <Grid gutter="lg" w={isSmallScreen ? '100%' : '55%'}>
          {/* TicketMaster */}
          <Grid.Col span={isSmallScreen ? 12 : 4}>
            <EventPriceOption
              price={selectedOption?.priceOptions?.[0]?.priceMin}
              color="green"
              source={'TicketMaster'}
              url={selectedOption?.url}
            />
          </Grid.Col>

          {/* TODO: SeatGeek Handle price & Url integration props */}
          <Grid.Col span={isSmallScreen ? 12 : 4}>
            <EventPriceOption color="#E49648" source={'SeatGeek'} />
          </Grid.Col>

          {/* TODO: StubHub Handle price integration props  */}
          <Grid.Col span={isSmallScreen ? 12 : 4}>
            <EventPriceOption color="#BD3133" source={'StubHub'} />
          </Grid.Col>
        </Grid>
      </Flex>
    </Stack>
  );
}
