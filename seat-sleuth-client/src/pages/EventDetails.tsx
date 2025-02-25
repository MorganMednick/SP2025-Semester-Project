import { Container, Text, Image, Flex, createTheme, MantineProvider, Title, Group, Card, Anchor, Checkbox, Stack, Divider, NativeSelect} from '@mantine/core';
import { EventData } from '@shared/api/external/eventData';
import { TicketMasterSearchParams } from '@shared/api/external/ticketMaster';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { fetchTicketMasterEvents } from '../api/functions/ticketMaster';

export default function EventDetails() {
  const { id } = useParams();
  const { data: events } = useQuery<EventData[], Error>(['ticketMasterEvents', id], async () => {
    const params: TicketMasterSearchParams = {
      id,
    };
    const res = await fetchTicketMasterEvents(params);
    return res.data || [];
  });
  if (!events || events.length === 0) {
    return <Text ta='center'>Event not found.</Text>;
  }

  const event = events[0];

  const date = new Date(event.startTime);
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = date.toLocaleDateString('en-US', options);

  const theme = createTheme({
    colors: {
      ticket_prices: ['#49905F', '#E49648', '#BD3133', '#48C6E4', '#4848E4', '#C648E4', '#E448C6', '#E44848', '#E4C648', '#5FE449'],
      //green is [0], orange [1], red[2]
    },
    fontFamily: "'Source Sans 3'",
    fontSizes: {
      xs: '16px',
      sm: '24px',
      md: '32px',
      lg: '36px',
      xl: '40px',
      xxl:'64px',
    },
    headings: {
      sizes: {
        h1: {
          fontWeight: '700',
          fontSize: '48px',
        },
        h2: {
          fontSize: '32px',
          fontWeight: '700',
        },
        h3: {
          fontSize: '32px',
        },
      },
    },
  });

  return (
    <MantineProvider theme={theme}>
      <>
        {event.imageSrc && event.name && (
          <Container
            fluid
            p={0}
            style={{ position: 'relative', marginBottom: '0px', padding: '0px' }}
          >
            <Image
              src={event.imageSrc[0]}
              alt={event.name}
              height={350}
              radius="md"
              width="100%"
              fit="cover"
            />
            <Title
              c="white"
              order={1}
              style={{
                position: 'absolute',
                bottom: '20px',
                left: '20px',
                padding: '10px 15px',
                borderRadius: '5px',
              }}
            >
              {event.name}
            </Title>
            <Checkbox
              color={theme.colors?.ticket_prices?.[0]}
              iconColor="white"
              label="Watch price"
              labelPosition="left"
              styles={{
                label: { color: 'white' },
              }}
              style={{
                position: 'absolute',
                bottom: '5px',
                right: '20px',
                padding: '10px 15px',
                borderRadius: '5px',
              }}
            />
          </Container>
        )}

        <Flex
          justify="flex-start"
          align="center"
          gap={0}
          p={0}
          style={{ marginTop: '-100px', marginRight: '0px', marginLeft: '70px' }}
        >
          <Stack
            h={300}
            bg="var(--mantine-color-body)"
            align="flex-start"
            justify="center"
            gap={100}
            style={{ marginTop: '100px' }}
          >
            <NativeSelect
              label="LOCATION"
              size="md"
              data={['filler', 'filler', 'filler']}
              styles={{
                label: {
                  color: theme.colors?.ticket_prices?.[0], // Change label color here
                  fontWeight: 700, // Set font weight
                  size: '20px',
                },
              }}
              style={{
                width: '300%',
              }}
            />

            <NativeSelect
              label="SECTION"
              size="md"
              data={['filler', 'filler', 'filler']}
              styles={{
                label: {
                  color: theme.colors?.ticket_prices?.[0], // Change label color here
                  fontWeight: 700, // Set font weight
                  size: '20px',
                },
              }}
              style={{
                width: '300%',
              }}
            />
          </Stack>

          <Text
            size="lg"
            mt="xs"
            tt="uppercase"
            style={{
              marginLeft: '400px',
              marginRight: '50px',
              textAlign: 'right',
            }}
          >
            {formattedDate}
          </Text>

          <Divider
            size="lg"
            color="black"
            orientation="vertical"
            style={{ height: '100px', marginTop: '150px' }}
          />

          <Stack
            h={300}
            bg="var(--mantine-color-body)"
            align="flex-start"
            justify="center"
            gap={1}
            style={{ marginLeft: '50px' }}
          >
            <Text size="md" mt={0} fw={700}>
              {event.city}
            </Text>
            <Text size="sm" mt={0} tt="uppercase">
              {event.venueName}
              <Anchor
                href={event.venueSeatMapSrc}
                target="_blank"
                size="sm"
                c="var(--mantine-color-primary)"
                td="underline"
                tt="lowercase"
                p={7}
              >
                see map
              </Anchor>
            </Text>
            <Text size="sm" mt={0}>
              section
            </Text>
          </Stack>
        </Flex>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            width: '100%',
            gap: '20px',
            paddingRight: '50px',
            paddingTop: '0px',
            marginTop: '-100px',
          }}
        >
          {event.priceMin && event.url && (
            <Card
              withBorder
              radius="md"
              style={{
                width: 251, // Adjust the size as needed
                height: 180,
                textAlign: 'center',
                position: 'relative',
                color: theme.colors?.ticket_prices?.[0],
                border: `2px solid ${theme.colors?.ticket_prices?.[0]}`,
                borderRadius: '10%',
              }}
            >
              <Text size="xxl" fw={700}>
                ${event.priceMin}
              </Text>
              <Group justify="center" mt={0}>
                <Anchor
                  href={event.url}
                  target="_blank"
                  c={theme.colors?.ticket_prices?.[0]}
                  size="xl"
                  td="underline"
                >
                  Ticketmaster
                </Anchor>
              </Group>
            </Card>
          )}
          <Card
            withBorder
            radius="md"
            py="md"
            style={{
              width: 251, // Adjust the size as needed
              height: 180,
              textAlign: 'center',
              position: 'relative',
              color: theme.colors?.ticket_prices?.[1],
              border: `2px solid ${theme.colors?.ticket_prices?.[1]}`,
              borderRadius: '10%',
            }}
          >
            <Text size="xxl" fw={700}>
              $##
            </Text>
            <Group justify="center" mt={0}>
              <Anchor
                href={event.url}
                target="_blank"
                c={theme.colors?.ticket_prices?.[1]}
                size="xl"
                td="underline"
              >
                StubHub
              </Anchor>
            </Group>
          </Card>

          <Card
            withBorder
            radius="md"
            py="md"
            style={{
              width: 251, // Adjust the size as needed
              height: 180,
              textAlign: 'center',
              position: 'relative',
              color: theme.colors?.ticket_prices?.[2],
              border: `2px solid ${theme.colors?.ticket_prices?.[2]}`,
              borderRadius: '10%',
            }}
          >
            <Text size="xxl" fw={700}>
              $##
            </Text>
            <Group justify="center" mt={0}>
              <Anchor
                href={event.url}
                target="_blank"
                c={theme.colors?.ticket_prices?.[2]}
                size="xl"
                td="underline"
              >
                SeatGeek
              </Anchor>
            </Group>
          </Card>
        </div>
      </>
    </MantineProvider>
  );
}
