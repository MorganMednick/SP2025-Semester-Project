import { Menu, Burger } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { SettingsModal } from './SettingsModal';
import { useAuth } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';
import { IconEye, IconLogout, IconSettings } from '@tabler/icons-react';

interface NavMenuProps {
  opened: boolean;
  onChange: () => void;
  onClose: () => void;
}

export default function NavMenu({ opened, onChange, onClose }: NavMenuProps) {
  const [settingsOpened, { open: openSettings, close: closeSettings }] = useDisclosure(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const menuIconSize = 14;

  return (
    <>
      <Menu zIndex={999} shadow="md" width={150} opened={opened} onClose={onClose}>
        <Menu.Target>
          <Burger size="md" opened={opened} onClick={onChange} />
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            leftSection={<IconEye size={menuIconSize} />}
            onClick={() => navigate('/watchlist')}
          >
            Watchlist
          </Menu.Item>
          <Menu.Item leftSection={<IconSettings size={menuIconSize} />} onClick={openSettings}>
            Settings
          </Menu.Item>
          <Menu.Item leftSection={<IconLogout size={menuIconSize} />} onClick={logout} c="red">
            Log out
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>

      <SettingsModal opened={settingsOpened} onClose={closeSettings} />
    </>
  );
}
