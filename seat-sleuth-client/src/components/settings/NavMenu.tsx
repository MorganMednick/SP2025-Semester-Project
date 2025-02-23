import { Menu, Burger } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { SettingsModal } from './SettingsModal';
import { useAuth } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';

interface NavMenuProps {
  opened: boolean;
  onChange: () => void;
  onClose: () => void;
}

export default function NavMenu({ opened, onChange, onClose }: NavMenuProps) {
  const [settingsOpened, { open: openSettings, close: closeSettings }] = useDisclosure(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <Menu shadow="md" width={150} opened={opened} onClose={onClose}>
        <Menu.Target>
          <Burger size="md" opened={opened} onClick={onChange} />
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item onClick={() => navigate('/watchlist')}>Watchlist</Menu.Item>
          <Menu.Item onClick={openSettings}>Settings</Menu.Item>
          <Menu.Item onClick={logout} c="red">
            Log out
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>

      <SettingsModal opened={settingsOpened} onClose={closeSettings} />
    </>
  );
}
