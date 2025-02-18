import { Text, Center, Container, Divider, Stack, Title, Group, Image, Paper } from '@mantine/core';
import SearchBar from '../search/Search';
import { seatGeekLogo, stubHubLogo, ticketMasterLogo } from '../../util/assetReconcileUtil';

export default function About() {
  return (
    <Container bg="green.7" fluid w="100%">
      <Container p={40} maw={1400}>
        <Stack justify="center">
          <Center p={30}>
            <Title c="white" order={1}>
              Watch ticket prices across platforms
            </Title>
          </Center>
          <Center>
            <SearchBar width={1000} size={'xl'}></SearchBar>
          </Center>
          <Center py={30}>
            <Divider size="md" w={'100%'} color="green.8" />
          </Center>
          <Title c="white" order={2}>
            Our philosophy
          </Title>
          <Text c="white">
            When it comes to resale tickets to concerts and sports games, there are a lot of
            options. You can compare them all, but then... there are the fees. That’s why we exist!
            We compile prices from all the major sites— fees included. We’ll even notify you when
            prices drop! Never worry about getting the best price again.{' '}
          </Text>
          <Paper bg="green.9" mt={20}>
            <Group p={20} gap="10%">
              <Text c="white" size="lg" ml={20}>
                Comparing prices from...
              </Text>
              <Image src={ticketMasterLogo} alt="Ticketmaster logo" />
              <Image src={stubHubLogo} alt="StubHub logo" />
              <Image src={seatGeekLogo} alt="SeakGeek logo" />
            </Group>
          </Paper>
        </Stack>
      </Container>
    </Container>
  );
}
