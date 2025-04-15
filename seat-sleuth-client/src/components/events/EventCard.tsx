import { Card, Image, Text } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useHover } from '@mantine/hooks';
import { EventMetaData } from '@client/types/shared/responses';

export default function EventCard({ event }: { event: EventMetaData }) {
  const navigate = useNavigate();
  const { hovered, ref } = useHover();

  return (
    <Card 
    ref={ref} 
    radius="md" 
    w="100%" 
    miw={175}
    shadow={hovered? "lg" : "none"}
    onClick={() =>
      navigate(`/events/${event.eventName.replace(/ /g, '-').replace(/\//g, '_')}`)
    }>

      <Image
        src={event?.coverImage || 'https://picsum.photos/400'}
        mah={175}
        mih={175}
        width={"100%"}
        alt={event.eventName}
        radius={"10px"}
        style={{ cursor: 'pointer' }}
      />
      <Text 
      pt="xs" 
      fw={600} 
      truncate
      c={hovered? "green.7" : "black"}
      td={hovered? "underline" : "none"}>
        {event.eventName}
      </Text>
      

    </Card>
  );
}
