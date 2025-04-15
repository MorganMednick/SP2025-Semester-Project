import { Text, Center, Container, Divider, Stack, Title, Group, Image, Paper } from '@mantine/core';
import SearchBar from '../search/Search';
import { vividSeatsLogo, stubHubLogo, ticketMasterLogo } from '../../util/assetReconcileUtil';

export default function About() {
  return (
    <Container bg="green.7" fluid w="100%">
      <Container p={40} maw={1400}>
        <Stack justify="center">
          <Center p={30}>
            <Title ta="center" c="white" order={1}>
              Watch ticket prices across platforms
            </Title>
          </Center>
          <Center>
            <SearchBar width={1000} size={'xl'} />
          </Center>
          <Center py={30}>
            <Divider size="md" w={'100%'} color="green.8" />
          </Center>
          <Title c="white" order={2}>
            Our philosophy
          </Title>
          <Text c="white">
            When it comes to resale tickets to concerts and sports games, there are a lot of
            options. Ever had to check accross reseller sites to find the best price? Such a pain!
            That’s where we come in -- we compile prices from all the major sites and even notify you when
            prices drop! Never worry about getting the best price again.{' '}
          </Text>
          <Paper bg="green.9" mt={20}>
            <Group gap="6%">
              <Text ml = {30} c="white" size="lg">
                Comparing prices from...
              </Text>
              <Image m={20} src={ticketMasterLogo} alt="Ticketmaster logo" />
              <Image m={20} src={stubHubLogo} alt="StubHub logo" />
              <Image m={20} src={vividSeatsLogo} alt="VividSeats logo" />
            </Group>
          </Paper>
        </Stack>
      </Container>
    </Container>
  );
}
