import { Card, Group, Image, Text, Box, Loader } from '@mantine/core';
import { arrowImg } from '../../util/assetReconcileUtil';
import { useHover } from '@mantine/hooks';
import { ApiResponse, ScrapingPriceResponse } from '@client/types/shared/responses';
import { getPriceForStubHubViaScraping, getPriceForVividSeatsViaScraping } from '@/api/functions/scrape';
import { useQuery } from 'react-query';
import { useState } from 'react';

interface EventPriceOption {
  price?: number | null;
  source: string;
  url?: string | null | undefined;
  eventName?: string,
  eventDate?: Date
}

export default function EventPriceOption({ price, source, url, eventName, eventDate }: EventPriceOption) {
  const { hovered, ref } = useHover();
  const [selectedPrice, setSelectedPrice] = useState<number | undefined>(price ?? undefined);
  const [selectedUrl, setSelectedUrl] = useState<string | undefined>(url ?? undefined);
  
  const validSource = selectedUrl && selectedPrice;
  
  let {
    isLoading: vividSeatsLoading
  } = useQuery<ScrapingPriceResponse | null, Error>(
    ['scrapeVividSeats', eventName, eventDate],
    async () => {
      setSelectedPrice(undefined)
      setSelectedUrl(undefined)
      if (eventName && eventDate) {
        const res: ApiResponse<ScrapingPriceResponse> = await getPriceForVividSeatsViaScraping({
          eventName,
          eventDate
        });
        setSelectedPrice(res?.data?.price)
        setSelectedUrl(res?.data?.url)
        return res?.data ?? null;
      }
      return null;
    },
    {
      enabled: (source === "VividSeats"),
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 30,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: false
    },
  );

  let {
    isLoading: stubHubLoading,
  } = useQuery<ScrapingPriceResponse | null, Error>(
    ['scrapeStubHub', eventName, eventDate],
    async () => {
      if (eventName && eventDate) {
        setSelectedPrice(undefined)
        setSelectedUrl(undefined)
        const res: ApiResponse<ScrapingPriceResponse> = await getPriceForStubHubViaScraping({
          eventName,
          eventDate
        });
        setSelectedPrice(res?.data?.price)
        setSelectedUrl(res?.data?.url)
        return res?.data ?? null;
      }
      return null;
    },
    {
      enabled: source === "StubHub",
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 30,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: false
    },
  );

  return (
  <Card component="a"
  ref={ref}
  withBorder
  bd={(validSource)? "2px solid green.7" :  "2px solid gray.6" }
  h="100"
  radius="10px" 
  w="450"
  p={0}
  bg= { validSource ? "green.2" : "gray.2"}
  href={selectedUrl?? undefined}
  target="_blank">
    
      <Group wrap="nowrap" gap={0} align={"center"}  >
        <Box bg={ validSource ? "green.7" : "gray.6"} h="100px" w="40%">
          { (source === "VividSeats" && vividSeatsLoading) || (source === "StubHub" && stubHubLoading) ? 
          <Loader mx="35%" my="30px" size="40px" color="white" />
          :
          <Text my="30px" size="40px" fw={700} c = "white" ta="center">
            {selectedPrice ? "$" + selectedPrice : "N/A"}
          </Text>}
        </Box>
        <Text w="60%" mx="20px" size="24px" c={ validSource ? "green.7" : "gray.6"} td={(hovered && validSource) ? "underline" : "none"}>
           on {source}
        </Text>
        { validSource? 
        <Image h="30px" pr ="10px" src={arrowImg} />
        :
        <Box w="30px"> </Box>
        }
      </Group>
    </Card>
  );
}
