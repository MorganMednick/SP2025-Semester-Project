import { Card, Center, Container, Divider, Stack, Title } from '@mantine/core';

// TODO: Make this actually render out our figma!! 1. Make a search bar component for the home page that replaces this card
export default function About() {
  return (
    <Container bg="green.4" fluid w="100%">
      <Container p={40}>
        <Stack gap={40}>
          <Center>
            <Title c="white" order={1} component="h1" size={46}>
              Watch ticket prices across platforms
            </Title>
          </Center>
          <Center>
            {/* TODO: Replace card with search bar */}
            <Card w={800}></Card>
          </Center>
          <Divider />
        </Stack>
      </Container>
    </Container>
  );
}
