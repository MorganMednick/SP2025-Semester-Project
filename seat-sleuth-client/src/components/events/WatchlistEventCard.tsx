import {Box, Text, Card, Image, Flex, Group, Button, Stack} from '@mantine/core';
import { SpecificEventData } from '@client/types/shared/responses';
import { formatDateToMonthDayYearString } from '../../util/uiUtils';
import { IconChevronCompactRight } from '@tabler/icons-react';

export default function EventCard({ event }: { event: SpecificEventData }) {
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
      <Flex align="center" h="100%" justify="center" direction="row">
        <Box w={200} maw={300}>
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

        <Stack pl={100} justify="flex-start" align="flex-start" gap="xs">
          <Text fw={700} size="xxl">
            {' '}
            {event.eventName}{' '}
          </Text>
          <Text size="xl">
            {formatDateToMonthDayYearString(event.startTime) || 'Unknown Date'} {'|'}{' '}
            {event.venueName} {'|'} {event.city}
          </Text>
        </Stack>
        <Button w={200} h={80} bg="green.10" radius="md" ml={300}>
          <Group gap={1} justify="flex-end">
            <Stack gap={0} align="center" justify="flex-start">
              <Text size="xxl" c="white" fw={700}>
                $100
              </Text>
              <Text size="xs" c="white">
                on ...
              </Text>
            </Stack>
            <IconChevronCompactRight size={50} color="white" />
          </Group>
        </Button>
      </Flex>
    </Card>
  );
}
