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
    xs: '16',
    sm: '20',
    md: '24',
    lg: '28',
    xl: '32',
  },
  headings: {
    sizes: {
      h1: {
        fontWeight: '700',
        fontSize: '48',
      },
      h2: {
        fontSize: '32',
        fontWeight: '700',
      },
      h3: {
        fontSize: '32',
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
