import { Card, Group, Anchor, Text } from '@mantine/core';

interface EventPriceOption {
  price?: number;
  color: string;
  source: string;
  url?: string | null | undefined;
}

export default function EventPriceOption({ price, color, source, url }: EventPriceOption) {
  return (
    <Card withBorder style={{ borderColor: color }} radius="md">
      {
      <Text size="lg" fw={700} style={{ color }} ta="center">
        {price ? `$${price.toFixed(2)}` : 'N/A'}
      </Text>}
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
