import { Card, Image, Text, Overlay, Center, Tooltip } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { EventMetaData } from '@shared/api/responses';
import { useHover } from '@mantine/hooks';

export default function EventCard({ event }: { event: EventMetaData }) {
  const navigate = useNavigate();
  const { hovered, ref } = useHover();

  return (
    <Card ref={ref} shadow="sm" padding="lg" radius="md" withBorder w="100%" miw={175}>
      <Tooltip
        label={event.eventName}
        position="top"
        color="green"
        withArrow
        transitionProps={{ duration: 200, transition: 'pop' }}
      >
        <Card.Section>
          <Image
            src={event?.coverImage || 'https://picsum.photos/400'}
            height={160}
            alt={event.eventName}
          />

          <Overlay
            gradient="linear-gradient(145deg, rgba(0, 0, 0, 0.95) 10%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0) 90%)"
            opacity={hovered ? 1.0 : 0.95}
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
      </Tooltip>
    </Card>
  );
}
