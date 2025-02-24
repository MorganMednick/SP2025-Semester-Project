import { useEffect, useState } from 'react';
import { Container } from '@mantine/core';
import { useParams } from 'react-router-dom';
import { fetchTicketMasterEvents } from '../api/functions/ticketMaster';
import { TicketMasterSearchParams } from '@shared/api/external/ticketMaster';
import { EventData } from '@shared/api/external/eventData';

export default function Event() {
  const { id } = useParams();
  useEffect(() => {
    const payload: TicketMasterSearchParams = { id };
    fetchTicketMasterEvents(payload)
      .then((res) => console.log(res))
      .catch((err) => console.error(err));
  }, []);
  return <Container p="xl"></Container>;
}
