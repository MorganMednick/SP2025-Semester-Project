import { useEffect, useState } from 'react';
import { Container } from '@mantine/core';
import { useParams } from 'react-router-dom';
import { fetchTicketMasterEvents } from '../api/functions/ticketMaster';
import { TicketMasterSearchParams } from '@shared/api/external/ticketMaster';

export default function Event() {
  const { id } = useParams();

  useEffect(() => {
    const payload: TicketMasterSearchParams = { id };
    fetchTicketMasterEvents(payload)
      .then((res) => console.log(res))
      .catch((err) => console.error(err));
  }, [id]);

  return (
    <Container p="xl">
      <h1>Event Info: </h1>
    </Container>
  );
}
