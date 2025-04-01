import { Flex, NativeSelect, Stack, Anchor, Text, Grid } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { EventData, SpecificEventData } from '@shared/api/responses';
import { SetStateAction } from 'react';
import EventPriceOption from './EventPriceOption';
import { formatDateToMonthDayYearString } from '../../util/uiUtils';

interface EventDetailsInfoSectionProps {
  event?: EventData | null;
  isLoading: boolean;
  isError: boolean;
  selectedEventId: string;
  setSelectedEventId: React.Dispatch<SetStateAction<string>>;
}

export default function EventDetailsInfoSection({
  event,
  isLoading,
  isError,
  selectedEventId,
  setSelectedEventId,
}: EventDetailsInfoSectionProps) {
  const isSmallScreen = useMediaQuery('(max-width: 1350px)');
  const eventFromIdProps: SpecificEventData =
    event?.instances.find((eventInstance) => eventInstance.ticketMasterId === selectedEventId) ||
    ({} as SpecificEventData);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading event details</div>;
  if (!event) return null;

  const options = event.instances || [];
  const locationsForEvent = options.map((instance) => ({
    label: `${instance.venueName || 'Unknown Venue'} - ${instance.city || 'Unknown City'}, ${instance.country || 'Unknown Country'}`,
    value: instance.ticketMasterId,
  }));

  return (
    <Stack justify="center" gap="xs">
      <Flex
        direction={isSmallScreen ? 'column' : 'row'}
        justify="space-between"
        align="flex-start"
        gap="xs"
      >
        <Stack w={isSmallScreen ? '100%' : '50%'} pt={5}>
          <Stack gap={2} pl={60} pt={20}>
            <Text size="xl" tt="uppercase">
              {formatDateToMonthDayYearString(eventFromIdProps.startTime) || 'Unknown Date'}
            </Text>
            <Text size="xxl" fw={700}>
              {eventFromIdProps?.city || 'Unknown City'}
            </Text>
            <Flex align="center">
              <Text size="xl" tt="uppercase">
                {eventFromIdProps?.venueName || 'Unknown Venue'}
              </Text>
              {eventFromIdProps?.seatMapSrc && (
                <Anchor href={eventFromIdProps.seatMapSrc} target="_blank" size="md" pl={5}>
                  See map
                </Anchor>
              )}
            </Flex>
          </Stack>
        </Stack>

        <Stack pr={100}>
          <Grid gutter="lg" w={isSmallScreen ? '100%' : '55%'}>
            {/* TicketMaster */}
            <Grid.Col span={isSmallScreen ? 12 : 4}>
              <EventPriceOption
                price={eventFromIdProps?.priceOptions?.[0]?.priceMin}
                color="green"
                source={'TicketMaster'}
                url={eventFromIdProps?.url}
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
          {/* Location Selector */}
          {locationsForEvent.length > 0 && (
            <NativeSelect
              label="Location"
              size="md"
              pr={0}
              data={locationsForEvent}
              value={selectedEventId || ''}
              onChange={
                (e) =>
                  setSelectedEventId(
                    e.target.value,
                  ) /* Should force re-render... this is needed for parent state refresh!!! */
              }
              w="100%"
              h={50}
              labelProps={{ style: { fontWeight: 'bold' } }}
            />
          )}
        </Stack>
      </Flex>
    </Stack>
  );
}
