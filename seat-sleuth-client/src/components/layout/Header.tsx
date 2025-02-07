import { AppShell, Button, Flex, Group, Image } from '@mantine/core';
import Search from '../search/Search';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const location = useLocation();
  let logoOrSearchBar;

  if (location.pathname === "/") {
    logoOrSearchBar = <Image w={250} src="src/assets/sloth_logo_with_text.png"/>
  } else {
    logoOrSearchBar = <Group>
      <Link to={"/"}>
        <Image w={70} src="src/assets/sloth_logo.png"/>
      </Link>
      <Search></Search>
    </Group>
  }

  return (
  <AppShell.Header>
    <Flex justify="space-between" align="center" p = "10">
      {logoOrSearchBar}
      <Button size="md" color="green.8">Sign in</Button>
    </Flex>
  </AppShell.Header>
)}
