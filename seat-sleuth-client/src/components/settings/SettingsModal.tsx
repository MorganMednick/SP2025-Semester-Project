import { Modal } from "@mantine/core";

interface SettingsModalProps {
  opened: boolean;
  onClose: () => void;
}

export function SettingsModal({ opened, onClose }: SettingsModalProps) {
  return (
    //TODO Create settings menu connected to database 
    <Modal opened={opened} onClose={onClose} title="Settings">
      <p>Settings</p>
    </Modal>
  );
}
