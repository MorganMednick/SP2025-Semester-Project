import { Card, Skeleton } from '@mantine/core';

export default function EventCardSkeleton() {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder w={1400}>
      <Card.Section>
        <Skeleton h={130} w={1400} />
      </Card.Section>
    </Card>
  );
}
