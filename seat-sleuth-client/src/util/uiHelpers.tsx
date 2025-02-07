import { notifications } from '@mantine/notifications';

export type CustomNotificationRequirements = {
  message: string;
  type: 'INFO' | 'SUCCESS' | 'ERROR';
};

export const showMantineNotification = ({ message, type }: CustomNotificationRequirements) => {
  const color = type === 'SUCCESS' ? 'green' : type === 'ERROR' ? 'red' : undefined;
  const title = type === 'SUCCESS' ? 'Success' : type === 'ERROR' ? 'Error' : 'FYI';
  const position: 'top' | 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' = 'bottom-right';
  notifications.show({
    title,
    message,
    color,
    position,
  });
};
