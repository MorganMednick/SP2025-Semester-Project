import { Flex, NativeSelect, Stack, Text, Title } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { EventData, SpecificEventData } from '@client/types/shared/responses';
import { SetStateAction } from 'react';
import EventPriceOption from './EventPriceOption';
import { formatDateToMonthDayYearString, formateDateToLocalTimeString } from '../../util/uiUtils';

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
    label: `${instance.city || 'Unknown City'}, ${instance.country || 'Unknown Country'}`,
    value: instance.ticketMasterId,
  }));

  return (

      <Flex
        direction={isSmallScreen ? 'column' : 'row'}
        justify="space-bewteen"
        align="flex-start"
        gap="15%"
        px={60}
      >
        <Stack w = "60%" pb={70}>
          <Stack gap={2} >
            <Title order={1} > {event.eventName} </Title>
            <Text size="xxl" tt="uppercase">
              {formatDateToMonthDayYearString(eventFromIdProps.startTime) || 'Unknown Date'}   •   {formateDateToLocalTimeString(eventFromIdProps.startTime) }
            </Text>
            <Text size="xxl">
              {eventFromIdProps?.venueName || 'Unknown Venue'}   •   {eventFromIdProps?.city || 'Unknown Venue'}
            </Text>
          </Stack>
          {/* Location Selector */}
          {locationsForEvent.length > 0 && (
              <NativeSelect
                label="Location"
                c="green.7" 
                size="xl"
                data={locationsForEvent}
                value={selectedEventId || ''}
                onChange={
                  (e) =>
                    setSelectedEventId(
                      e.target.value,
                    ) /* Should force re-render... this is needed for parent state refresh!!! */
                }
                h={50}
                labelProps={{ style: { fontWeight: 'bold'} }}
              />
            )}
        </Stack>
        <Stack gap={15}>
            {/* TicketMaster */}
            <EventPriceOption
              price={eventFromIdProps?.priceOptions?.[0]?.priceMin}
              source={'TicketMaster'}
              url={eventFromIdProps?.url}
            />
            <EventPriceOption source={'StubHub'} eventName={event.eventName} eventDate={eventFromIdProps.startTime}/>
            <EventPriceOption source={'VividSeats'} eventName={event.eventName} eventDate={eventFromIdProps.startTime} />

        </Stack>
      </Flex>

  );
}
