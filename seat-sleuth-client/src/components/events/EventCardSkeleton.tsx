import { Card, Button, Stack, Skeleton } from '@mantine/core';

export default function EventCardSkeleton() {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder w="100%">
      <Stack justify="space-between">
        <Card.Section>
          <Skeleton h={160} />
        </Card.Section>
        <Skeleton h={25} w="100%" />
        <Skeleton h={25} w="100%" />
        <Skeleton h={25} w="100%" />

        <Button fullWidth mt="md" variant="outline">
          View Event Details
        </Button>
      </Stack>
    </Card>
  );
}
