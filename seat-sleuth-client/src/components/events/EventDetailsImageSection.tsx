import { Image, Box } from '@mantine/core';
import { EventData } from '@client/types/shared/responses';
import AddToWatchlistCheckbox from '../watchlist/AddToWatchlistCheckbox';

interface EventDetailsImageSectionProps {
  event?: EventData | null;
  selectedEventId: string;
}

export default function EventDetailsImageSection({
  event,
  selectedEventId,
}: EventDetailsImageSectionProps) {
  return (
    <>
      {event && (
        <Box
          w="100vw"
          pos="relative"
          left="50%"
          right="50%"
          ml="-50vw"
          mr="-50vw"
          pt={0}
          pb={30}
          mt="-40px"
          justify-content="center"
        >
          <Image
            src={event?.coverImage}
            h={'45vh'}
            width="auto"
            alt={event.eventName}
            fit="cover"
            fallbackSrc="https://placehold.co/600x400?text=Not Found"
            style={{
              objectPosition: 'center top',
            }}
          />
          <AddToWatchlistCheckbox
            event={event}
            selectedEventId={selectedEventId}
          ></AddToWatchlistCheckbox>
        </Box>
      )}
    </>
  );
}
