import { AppShell, Button, Flex, Group, Image } from '@mantine/core';
import { modals } from '@mantine/modals';
import Auth from '../../pages/Auth';
import { slothLogo, slothLogoWithText } from '../../util/assetReconcileUtil';
import { useAuth } from '../../context/authContext';
import Search from '../search/Search';
import { Link, useLocation } from 'react-router-dom';
import NavMenu from '../settings/NavMenu';
import { useDisclosure } from '@mantine/hooks';

export default function Header() {
  const { isAuthenticated } = useAuth();
  const [navOpened, { toggle: toggleNav, close: closeNav }] = useDisclosure(false);
  const location = useLocation();
  let logoOrSearchBar;
  // TODO: Update this to be responsive to mobile. Maybe get rid of logo  or use the smaller one for mobile layout
  if (location.pathname === '/') {
    logoOrSearchBar = <Image w={250} src={slothLogoWithText} />;
  } else {
    logoOrSearchBar = (
      <Group align="center" justify="space-between">
        <Link to={'/'}>
          <Image w={70} src={slothLogo} visibleFrom="xs" />
        </Link>
        <Search width={300}/>
      </Group>
    );
  }

  return (
    <AppShell.Header h="fit-content" zIndex={999}>
      <Flex justify="space-between" align="center" p={10} h={80}>
        {logoOrSearchBar}
        {!isAuthenticated ? (
          <Button
            onClick={() => {
              modals.open({
                size: 'xl',
                centered: true,
                children: <Auth />,
              });
            }}
            size="md"
          >
            Sign In
          </Button>
        ) : (
          <NavMenu opened={navOpened} onChange={toggleNav} onClose={closeNav}></NavMenu>
        )}
      </Flex>
    </AppShell.Header>
  );
}
