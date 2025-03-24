import { Flex, NativeSelect, Stack, Anchor, Divider, Text, Group, Card, Grid } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { EventData } from '@shared/api/responses';
import {  useState } from 'react';

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
  const options = event?.instances || [];
  const otherLocationsForEvent: { label: string; value: string }[] = options.map((instance) => ({
    label: `${instance.venueName} - ${instance.city}, ${instance.country}`,
    value: instance.ticketMasterId,
  }));

  const [selectedOption, setSelectedOption] = useState(options[0] || null);

  const handleLocationChange = (selectedEventId: string) => {
    const selectedEvent = options.find((evt) => evt.ticketMasterId === selectedEventId);

    if (selectedEvent) {
      setSelectedOption(selectedEvent);
    }
  };



  const formattedDate =
     selectedOption
      ? new Date(selectedOption.startTime).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : '';


  const isSmallScreen = useMediaQuery('(max-width: 1350px)');
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading event details</div>;
  return (
    <Stack justify="center" gap="xxs">
      <Flex
        direction={isSmallScreen ? 'column' : 'row'}
        justify="space-between"
        align="flex-start"
        gap="xxs"
      >
        <Stack justify="center" gap={0} w={isSmallScreen ? '100%' : '50%'} pt={5}>
          <Group align="center">
            <Text size="x" tt="uppercase" ta="left">
              {formattedDate}
            </Text>
            <Divider size="lg" color="black" orientation="vertical" h={100} />
            <Stack align="flex-start" gap={0}>
              <Text size="xxl" ta="left" fw={700} maw={400}>
                {selectedOption?.city || 'Unknown City'}
              </Text>
              <Flex align="center" gap={0}>
                <Text size="xl" tt="uppercase" ta="left" maw={400}>
                  {selectedOption?.venueName || 'Unknown Venue'}
                </Text>
                {selectedOption && selectedOption.seatMapSrc ? (
                  <Anchor
                    href={selectedOption?.seatMapSrc}
                    target="_blank"
                    size="md"
                    td="underline"
                    pl={5}
                  >
                    See map
                  </Anchor>
                ) : (
                  <Text size="xl"></Text>
                )}
              </Flex>
            </Stack>
          </Group>

          <NativeSelect
            label="Location"
            size="md"
            c="black"
            data={otherLocationsForEvent}
            w="75%" // Makes it responsive on small screens
            h={60}
            labelProps={{ style: { fontWeight: 'bold' } }}
            onChange={(e) => handleLocationChange(e.target.value)}
          />
        </Stack>

        <Grid justify="space-between" pt={5} gutter="lg" w={isSmallScreen ? '100%' : '55%'}>
          <Grid.Col span={isSmallScreen ? 12 : 4}>
            <Card withBorder bd="2px solid #49905F" radius="md">
              <Text size="xxxx" fw={700} c="green.7" ta="center">
                {selectedOption?.priceOptions?.[0]?.priceMin
                  ? `$${selectedOption.priceOptions[0].priceMin}`
                  : 'N/A'}{' '}
              </Text>
              <Group justify="center">
                <Anchor
                  href={selectedOption?.url || undefined}
                  target="_blank"
                  c="green.7"
                  size="xx"
                >
                  TicketMaster
                </Anchor>
              </Group>
            </Card>
          </Grid.Col>

          <Grid.Col span={isSmallScreen ? 12 : 4}>
            <Card withBorder bd="2px solid #E49648" radius="md">
              <Text size="xxxx" fw={700} c="#E49648" ta="center">
                $49.99
              </Text>
              <Group justify="center">
                <Anchor
                  href={selectedOption?.url || undefined}
                  target="_blank"
                  c="#E49648"
                  size="xx"
                >
                  SeatGeek
                </Anchor>
              </Group>
            </Card>
          </Grid.Col>

          <Grid.Col span={isSmallScreen ? 12 : 4}>
            <Card
              withBorder
              bd="2px solid #BD3133"
              radius="md"
            >
              <Text size="xxxx" fw={700} c="#BD3133" ta="center">
                ${69.69}
              </Text>
              <Group justify="center">
                <Anchor
                  href={selectedOption?.url || undefined}
                  target="_blank"
                  c="#BD3133"
                  size="xx"
                >
                  StubHub
                </Anchor>
              </Group>
            </Card>
          </Grid.Col>
        </Grid>
      </Flex>
    </Stack>
  );
}
