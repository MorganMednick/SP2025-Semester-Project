import { Card, Skeleton } from '@mantine/core';

export default function EventCardSkeleton() {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder w="100%" miw={175}>
      <Card.Section>
        <Skeleton h={160} w="100%" />
      </Card.Section>
    </Card>
  );
}
