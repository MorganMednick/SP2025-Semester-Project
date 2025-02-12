import { useEffect, useState } from 'react';
import { useGeoPoint } from '../../hooks/hooks';
import { EventData } from '@shared/api/external/eventData';
import { fetchTicketMasterEvents } from '../../api/functions/ticketMaster';
import { TicketMasterSearchParams } from '@shared/api/external/ticketMaster';

export default function PopularNearYou() {
  const { geoPoint } = useGeoPoint();
  const [eventsNearYou, setEventsNearYou] = useState<EventData[]>([]);
  useEffect(() => {
    if (geoPoint) {
      const nearMeParams: TicketMasterSearchParams = {
        geoPoint: geoPoint || '',
        radius: '50',
        unit: 'miles',
        sort: 'relevance,desc',
        size: '20',
        page: '1',
      };
      fetchTicketMasterEvents(nearMeParams).then((res) => setEventsNearYou(res.data || []));
    }
  }, [geoPoint]);
  // TODO: Handle loading state for api response as well as general rendering. Take a look at https://mantine.dev/core/skeleton/ for loading state and https://mantine.dev/core/card/ for popular events near you section.
  return JSON.stringify(eventsNearYou);
}
