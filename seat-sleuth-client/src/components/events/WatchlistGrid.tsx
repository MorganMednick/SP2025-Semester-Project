import { useState, useEffect } from 'react';
import { Stack, Grid, Text, Box, Center, Transition } from '@mantine/core';
import WatchlistCardSkeleton from '../events/WatchlistCardSkeleton';
import { useAppropriateGridColumnCount } from '../../hooks/hooks';
import {  SpecificEventData } from '@client/types/shared/responses';
import WatchlistEventCard from './WatchlistEventCard';

interface WatchlistGridProps {
  events?: SpecificEventData[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

export default function WatchlistGrid({ events, isLoading, isError, error }: WatchlistGridProps) {
  const COL_SPAN = useAppropriateGridColumnCount();
  const CARD_SLIDE_ANIMATION_DELAY = 25;
  const CARD_SLIDE_ANIMATION_DURATION = 250;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (events) {
      setTimeout(() => setMounted(true), CARD_SLIDE_ANIMATION_DURATION);
    } else {
      setMounted(false);
    }
  }, [events]);

  if (isLoading) {
    return (
      <Grid gutter="xl" p="md">
        {Array.from({ length: 8 }, (_, index) => (
          <Grid.Col key={index} span={COL_SPAN}>
            <WatchlistCardSkeleton />
          </Grid.Col>
        ))}
      </Grid>
    );
  }

  if (isError) {
    return (
      <Center py="xl">
        <Text c="red" size="lg" fw={500}>
          {error?.message || 'An error occurred while fetching events.'}
        </Text>
      </Center>
    );
  }


  return (
    <Stack h={300} align="stretch" justify="flex-start" gap="md">
      {events && events.length > 0 ? (
        events.map((event, index) => (
          <Transition
            key={event.eventName}
            mounted={mounted}
            transition="slide-right"
            duration={CARD_SLIDE_ANIMATION_DURATION}
            enterDelay={index * CARD_SLIDE_ANIMATION_DELAY}
            timingFunction="ease"
          >
            {(styles) => (
              <Box style={{ ...styles, marginLeft: '5%' }}>
                <WatchlistEventCard event={event} />
              </Box>
            )}
          </Transition>
        ))
      ) : (
        <Center py="xl">
          <Text size="lg" fw={500} c="dimmed">
            No events found.
          </Text>
        </Center>
      )}
    </Stack>
  );
}
