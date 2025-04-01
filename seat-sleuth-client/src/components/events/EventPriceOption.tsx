import { Card, Group, Anchor, Text } from '@mantine/core';

interface EventPriceOption {
  price?: number | null;
  color: string;
  source: string;
  url?: string | null | undefined;
}

export default function EventPriceOption({ price, color, source, url }: EventPriceOption) {
  return (
    <Card withBorder style={{ borderColor: color }} radius="md" w="auto" miw={220}>
      <Text size="xl" fw={700} c = {color} ta="center">
        {price ? `$${price.toFixed(2)}` : 'N/A'}
      </Text>
      <Group justify="center">
        {url ? (
          <Anchor href={url} target="_blank" style={{ color }}>
            {source}
          </Anchor>
        ) : (
          <Text style={{ color }}>{source}</Text>
        )}
      </Group>
    </Card>
  );
}
