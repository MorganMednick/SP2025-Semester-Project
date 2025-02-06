import { AppShell, Button, Flex, Image } from '@mantine/core';

export default function Header() {
  return (
  <AppShell.Header >
    <Flex justify="space-between" align="center" p = "10">
      <Image w={250} src="src/assets/sloth_logo_with_text.png"/>
      <Button size="md" color="green.8">Sign in</Button>
    </Flex>
  </AppShell.Header>
)}
