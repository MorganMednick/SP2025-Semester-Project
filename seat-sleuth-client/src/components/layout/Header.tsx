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

  if (location.pathname === "/") {
    logoOrSearchBar = <Image w={250} src={slothLogoWithText}/>
  } else {
    logoOrSearchBar = <Group>
      <Link to={"/"}>
        <Image w={70} src={slothLogo}/>
      </Link>
      <Search></Search>
    </Group>
  }
    
  return (
    <AppShell.Header h="fit-content">
      <Flex justify="space-between" align="center" p={20} h={80}>
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
            Sign in
          </Button>
        ) : (
          <Button onClick={logout} size="md" color="red">
            Logout
          </Button>
        )}
      </Flex>
    </AppShell.Header>
  );
}
