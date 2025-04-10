import { Card, Image, Text, Overlay, Center } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useHover } from '@mantine/hooks';
import { EventMetaData } from '@client/types/shared/responses';

export default function EventCard({ event }: { event: EventMetaData }) {
  const navigate = useNavigate();
  const { hovered, ref } = useHover();

  return (
    <Card ref={ref} shadow="sm" padding="lg" radius="md" withBorder w="100%" miw={175}>
      <Card.Section>
        <Image
          src={event?.coverImage || 'https://picsum.photos/400'}
          height={160}
          alt={event.eventName}
        />

        <Overlay
          opacity={hovered ? 1 : 0.8}
          style={{ cursor: 'pointer' }}
          onClick={() =>
            navigate(`/events/${event.eventName.replace(/ /g, '-').replace(/\//g, '_')}`)
          }
        >
          <Center w="100%" h="100%" px={12}>
            <Text c="white" size="xl" fw={600} ta="center" lineClamp={2}>
              {event.eventName}
            </Text>
          </Center>
        </Overlay>
      </Card.Section>
    </Card>
  );
}
