import { useEffect, useState } from 'react';
import { Image, Flex, Title, Checkbox, Box } from '@mantine/core';
import { EventData, SpecificEventData } from '@shared/api/responses';
import { addToWatchList } from '../../api/functions/watchlist';
import { useAuth } from '../../context/authContext';
import { responseIsOk } from '../../util/apiUtils';
import { showMantineNotification } from '../../util/uiUtils';

interface EventDetailsImageSectionProps {
  event?: EventData | null;
  isLoading: boolean;
  isError: boolean;
  selectedEventId: string;
}

export default function EventDetailsImageSection({
  event,
  isLoading,
  isError,
  selectedEventId,
}: EventDetailsImageSectionProps) {
  const { isAuthenticated, userId } = useAuth();
  const [isChecked, setIsChecked] = useState(false);

  const specificEvent: SpecificEventData | undefined =
    event?.instances?.find((eventInstance) => eventInstance.ticketMasterId === selectedEventId) ||
    ({} as SpecificEventData);

  const isWatcher = !!specificEvent.watchers?.find((watcher) => watcher.userId === userId);

  const userIsWatchingAndLoggedIn = isWatcher && userId !== -1;

  const [disabled, setDisabled] = useState(!isAuthenticated && userIsWatchingAndLoggedIn);

  useEffect(() => {
    setDisabled(!isAuthenticated && !userIsWatchingAndLoggedIn); // Mirror disabled state via auth state. No need to refresh to refetch! -Jayce
    console.info(userId);
  }, [isAuthenticated, selectedEventId, userId]);

  const handleCheckboxChange = async (checked: boolean | ((prevState: boolean) => boolean)) => {
    if (isAuthenticated && selectedEventId) {
      setIsChecked(checked);
      setDisabled(true);
      const res = await addToWatchList({
        eventInstanceId: selectedEventId,
        event: event || ({} as EventData),
      });
      if (responseIsOk(res)) {
        showMantineNotification({
          message: `Event with id of ${selectedEventId} has been added to your watchlist`,
          type: 'INFO',
        });
      } else {
        showMantineNotification({
          message: `Failed to add event with id of ${selectedEventId} to your watchlist`,
          type: 'ERROR',
        });
      }
      setDisabled(false);
    } else {
      console.error('You should not be able to add to watchlist if not logged in. Fix me.');
    }
  };

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
          pb={55}
          mt="-40px"
          justify-content="center"
        >
          <Image
            src={event?.coverImage}
            mah={450}
            width="auto"
            alt={event.eventName}
            fit="cover"
            fallbackSrc="https://placehold.co/600x400?text=Not Found"
            style={{
              objectPosition: 'center top', // Not in mantine style props
            }}
          />
          <Flex
            justify="space-between"
            align="center"
            pos="absolute"
            top={460}
            left={30}
            right={30}
            bottom={10}
          >
            <Box>
              <Title order={1} c="green.7">
                {event.eventName}
              </Title>
            </Box>
            {!isLoading && !isError ? (
              <Checkbox
                color="green.7"
                iconColor="black"
                label="Watch price"
                labelPosition="left"
                styles={(theme) => ({
                  label: {
                    color: theme.colors.green[7],
                    fontSize: theme.fontSizes.md,
                    fontWeight: 600,
                  },
                })}
                checked={isChecked}
                disabled={disabled}
                onChange={(event) => handleCheckboxChange(event.currentTarget.checked)}
              />
            ) : (
              <Checkbox
                color="green"
                iconColor="white"
                label="Login to watch price"
                labelPosition="left"
                styles={(theme) => ({
                  label: {
                    color: 'white',
                    fontSize: theme.fontSizes.sm,
                  },
                })}
                checked={false}
                disabled={true}
              />
            )}
          </Flex>
        </Box>
      )}
    </>
  );
}
