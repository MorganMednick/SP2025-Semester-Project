import { Box, Text, Card, Image, Flex, Group, Button, Stack } from '@mantine/core';
import { SpecificEventData } from '@client/types/shared/responses';
import { formatDateToMonthDayYearString } from '../../util/uiUtils';
import { whiteArrow } from '../../util/assetReconcileUtil';

export default function EventCard({ event }: { event: SpecificEventData }) {
  const lowestPriceOption = event.priceOptions?.length
    ? event.priceOptions.reduce((min, option) => (option.price < min.price ? option : min)) // WHIPPIN OUT THAT 131 Math.min() FUNCTION 😎
    : null;

  return (
    <Card
      shadow="none"
      padding="lg"
      radius="md"
      withBorder
      style={{ borderColor: '#555252' }}
      w={{ base: 375, sm: 700, lg: 1400 }}
      h={130}
    >
      <Flex align="center" h="100%" justify="flex-start" direction="row">
        <Box w={200} maw={300} mr={25}>
          <Image
            src={event?.coverImage || 'https://picsum.photos/400'}
            h={110}
            w={200}
            maw={300}
            alt={event.eventName}
            fit="cover"
            radius={'10px'}
          />
        </Box>

        <Stack pl={20} justify="flex-start" align="flex-start" gap="xs" pr={100}>
          <Text fw={700} size="xxl">
            {event.eventName}{' '}
          </Text>
          <Text size="xl">
            {formatDateToMonthDayYearString(event.startTime) || 'Unknown Date'} {'|'}{' '}
            {event.venueName} {'|'} {event.city}
          </Text>
        </Stack>
        <Button
          w={175}
          h={80}
          bg="green.10"
          radius="md"
          justify="flex-end"
          pl={0}
          ml="auto"
          onClick={() => {
            if (lowestPriceOption?.url) {
              window.open(lowestPriceOption.url, '_blank', 'noopener,noreferrer');
            }
          }}
        >
          <Group gap={5} justify="flex-end">
            <Stack gap={0} align="center" justify="flex-start" pr={10}>
              <Text size="xxl" c="white" fw={700}>
                ${lowestPriceOption?.price?.toFixed(2) || '0.00'}
              </Text>
              <Text size="xs" c="white">
                on {lowestPriceOption?.source}
              </Text>
            </Stack>
            <Image h="30px" pr="5px" src={whiteArrow} />
          </Group>
        </Button>
      </Flex>
    </Card>
  );
}
