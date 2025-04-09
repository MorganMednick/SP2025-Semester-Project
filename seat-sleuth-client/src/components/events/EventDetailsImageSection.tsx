import { useState } from 'react';
import { Image, Flex, Title, Checkbox, Box } from '@mantine/core';
import { EventData } from '@client/types/shared/responses';
import {
  addToWatchList,
  checkIfUserIsWatchingParticularEventInstance,
  removeFromWatchList,
} from '../../api/functions/watchlist';
import { responseIsOk } from '../../util/apiUtils';
import { showMantineNotification } from '../../util/uiUtils';
import { useQuery } from 'react-query';
import { useAuthDisabled } from '../../hooks/hooks';

interface EventDetailsImageSectionProps {
  event?: EventData | null;
  selectedEventId: string;
}

export default function EventDetailsImageSection({
  event,
  selectedEventId,
}: EventDetailsImageSectionProps) {
  const baseDisabled = useAuthDisabled();
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const checkboxDisabled = baseDisabled || loading;

  useQuery(
    ['checkIfUserIsWatchingParticularEventInstance', selectedEventId],
    async () => {
      return await checkIfUserIsWatchingParticularEventInstance({
        eventInstanceId: selectedEventId,
      });
    },
    {
      enabled: !!selectedEventId && !baseDisabled,
      onSuccess: (res) => {
        setIsChecked(responseIsOk(res));
      },
      onError: () => {
        setIsChecked(false);
      },
      retry: false, // <= Need this to trigger only once. should be refetched on auth change so this is so fine!
      cacheTime: 0, // NO CACHING FOR THIS SIMPLE REQ
      staleTime: 0,
      refetchOnMount: true, // Basically useEffect()
      refetchOnWindowFocus: true,
    },
  );

  const handleCheckboxChange = async (checked: boolean) => {
    if (baseDisabled || !selectedEventId) {
      console.error('You must be logged in to update your watchlist.');
      return;
    }

    setLoading(true);
    setIsChecked(checked);

    try {
      const res = checked
        ? await addToWatchList({
            eventInstanceId: selectedEventId,
            event: event || ({} as EventData),
          })
        : await removeFromWatchList({
            eventInstanceId: selectedEventId,
          });

      if (responseIsOk(res)) {
        showMantineNotification({
          message: `Event ${checked ? 'added to' : 'removed from'} your watchlist.`,
          type: 'INFO',
        });
      } else {
        showMantineNotification({
          message: `Failed to ${checked ? 'add' : 'remove'} the event.`,
          type: 'ERROR',
        });
        setIsChecked(!checked);
      }
    } catch (err) {
      console.error(err);
      showMantineNotification({
        message: `An error occurred.`,
        type: 'ERROR',
      });
      setIsChecked(!checked);
    } finally {
      setLoading(false);
    }
  };

  const getLabelForWatchlistCheckbox = (): string => {
    if (baseDisabled) return 'Login to add to watchlist';
    return isChecked ? 'Remove this event from watchlist' : 'Watch this event';
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
          pb={30}
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
              objectPosition: 'center top',
            }}
          />
          <Flex
            justify="space-between"
            align="center"
            pos="absolute"
            top={480}
            left={30}
            right={0}
            bottom={0}
          >
            <Box>
              <Title order={1} c="black" pl={60}>
                {event.eventName}
              </Title>
            </Box>
            <Checkbox
              color="green.7"
              iconColor="white"
              label={getLabelForWatchlistCheckbox()}
              pt={450}
              pr={85}
              labelPosition="left"
              styles={(theme) => ({
                label: {
                  color: 'black',
                  fontSize: theme.fontSizes.md,
                  fontWeight: 600,
                },
              })}
              checked={isChecked}
              disabled={checkboxDisabled}
              onChange={(event) => handleCheckboxChange(event.currentTarget.checked)}
            />
          </Flex>
        </Box>
      )}
    </>
  );
}
