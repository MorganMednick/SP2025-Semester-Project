import { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { AppShell } from '@mantine/core';
import Header from './Header';
import Footer from './Footer';

interface AppShellProps {
  children?: ReactNode;
}

const Shell = ({ children }: AppShellProps) => {
  return (
    <AppShell header={{ height: 64 }}>
      <Header />
      <AppShell.Main pt={80}>{children || <Outlet />}</AppShell.Main>
      <Footer />
    </AppShell>
  );
};

export default Shell;
