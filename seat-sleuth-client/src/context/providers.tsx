import { ReactNode } from 'react';
import { MantineProvider, createTheme } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { AuthProvider } from './authContext';
import { Notifications } from '@mantine/notifications';

const theme = createTheme({
  primaryColor: 'green',
  primaryShade: 7,
  colors: {
    green: [
      '#ebfaf0',
      '#ddf0e3',
      '#bddec7',
      '#9acba9',
      '#7cbb8f',
      '#68b17e',
      '#5dac75',
      '#4c9763',
      '#418657',
      '#327448',
    ],
  },
  fontFamily: "'Source Sans 3'",
  fontSizes: {
    xs: '16px',
    sm: '18px',
    md: '20px',
    lg: '22px',
    xl: '24px',
  },
  headings: {
    sizes: {
      h1: {
        fontWeight: '700',
        fontSize: '48px',
      },
      h2: {
        fontSize: '32px',
        fontWeight: '700',
      },
      h3: {
        fontSize: '32px',
      },
    },
  },
});

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <MantineProvider theme={theme}>
        <Notifications />
        <ModalsProvider>{children}</ModalsProvider>
      </MantineProvider>
    </AuthProvider>
  );
}
