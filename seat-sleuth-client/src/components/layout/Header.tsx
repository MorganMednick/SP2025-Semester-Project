import { AppShell, Button, Flex, Image } from '@mantine/core';
import { modals } from '@mantine/modals';
import Auth from '../../pages/Auth';
import { slothLogo, slothLogoWithText } from '../../util/assetReconcileUtil';
import { useAuth } from '../../context/authContext';

export default function Header() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <AppShell.Header h="fit-content">
      <Flex justify="space-between" align="center" p={20} h={80}>
        <Image h="90%" src={slothLogoWithText} visibleFrom="xs" />
        <Image h={50} src={slothLogo} hiddenFrom="xs" />
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
