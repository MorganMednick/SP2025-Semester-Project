import { AppShell, Button, Flex, Group, Image } from '@mantine/core';
import { modals } from '@mantine/modals';
import Auth from '../../pages/Auth';
import { slothLogo, slothLogoWithText } from '../../util/assetReconcileUtil';
import { useAuth } from '../../context/authContext';
import Search from '../search/Search';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const { isAuthenticated, logout } = useAuth();
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
        <Search />
      </Group>
    );
  }

  return (
    <AppShell.Header h="fit-content">
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
          // TODO: Remove this logout button and replace it with hamburger menu: https://mantine.dev/core/menu/ & https://mantine.dev/core/burger/ The menu should be its own component for refactorability.
          <Button onClick={logout} size="md" color="red">
            Log Out
          </Button>
        )}
      </Flex>
    </AppShell.Header>
  );
}
