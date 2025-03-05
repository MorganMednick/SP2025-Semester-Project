import { Text, Container } from '@mantine/core';
import { EventOptionData, EventWithOptions } from '@shared/api/responses';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { fetchTicketMasterEvents } from '../api/functions/ticketMaster';

export default function EventDetails() {
  const { name } = useParams();
  const {
    data: eventWithOptions,
    isLoading,
    isError,
  } = useQuery<EventWithOptions | null, Error>(
    ['eventWithOptions', name],
    async () => {
      const res = await fetchTicketMasterEvents({ keyword: name });
      console.info('EventDetails.tsx: fetchTicketMasterEvents', res);
      return res?.data?.[0] ?? null; // ✅ Return `null` if no event is found
    },
    { enabled: !!name },
  );

  if (!event) {
    return <Text ta="center">Event not found.</Text>;
  }

  return (
    <Container fluid w="100%" p={0} m={0}>
      {name}
      <br />
      <br />
      Stringified res:
      <br />
      <br />
      {!isError && !isLoading && eventWithOptions && JSON.stringify(eventWithOptions)}
      <br />
      <br />
      There are {eventWithOptions?.options?.length} options.
      <br />
      <br />
      {!isError && !isLoading && eventWithOptions && JSON.stringify(eventWithOptions.options)}
    </Container>
  );
}
