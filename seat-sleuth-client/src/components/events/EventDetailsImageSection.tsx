import { useState } from 'react';
import { Image, Flex, Title, Checkbox, Box } from '@mantine/core';
import { EventData } from '@shared/api/responses';

interface EventDetailsImageSectionProps {
  event?: EventData | null;
  isLoading: boolean;
  isError: boolean;
}

export default function EventDetailsImageSection({
  event,
  isLoading,
  isError,
}: EventDetailsImageSectionProps) {
  const [isChecked, setIsChecked] = useState(false);
  const [disabled] = useState(false);

  const handleCheckboxChange = (checked: boolean | ((prevState: boolean) => boolean)) => {
    setIsChecked(checked);
    // TODO
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
            height={450}
            width="auto"
            alt={event.eventName}
            fit="cover"
            fallbackSrc="https://placehold.co/600x400?text=Not Found"
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
