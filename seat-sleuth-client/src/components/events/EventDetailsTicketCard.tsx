import { Text,Card,Group,Anchor,Flex } from '@mantine/core';



interface TicketProps {
  priceMin?: number | null;
  url?: string | null;
}


export default function EventDetailsTicketCard({priceMin,url}: TicketProps) {
  return (
    <div>
      <Flex justify="flex-end" pr={50} gap="xl" mt={-10} mb={10}>
        {priceMin && url && (
          <Card
            withBorder
            radius="md"

            w={251}
            h={180}
            style={{ borderColor: '#49905F', borderWidth: 2 }}
          >
            <Text size="xxxx" fw={700} c="green.7" ta="center" mt={-10}>
              ${priceMin}
            </Text>
            <Group justify="center" mt={-10}>
              <Anchor href={url || undefined} target="_blank" c="green.7" size="xx">
                TicketMaster
              </Anchor>
            </Group>
          </Card>
        )}
        <Card
          withBorder
          radius="md"
          w={251}
          h={180}
          style={{ borderColor: '#E49648', borderWidth: 2 }}
        >
          <Text size="xxxx" fw={700} c="#E49648" ta="center" mt={-10}>
            $49.99
          </Text>
          <Group justify="center" mt={-10}>
            <Anchor href={url || undefined} target="_blank" c="#E49648" size="xx">
              SeatGeek
            </Anchor>
          </Group>
        </Card>
        <Card
          withBorder
          radius="md"
          w={251}
          h={180}
          style={{ borderColor: '#BD3133', borderWidth: 2 }}
        >
          <Text size="xxxx" fw={700} c="#BD3133" ta="center" mt={-10}>
            ${69.69}
          </Text>
          <Group justify="center" mt={-10}>
            <Anchor href={url || undefined} target="_blank" c="#BD3133" size="xx">
              StubHub
            </Anchor>
          </Group>
        </Card>
      </Flex>
    </div>
  );
}
