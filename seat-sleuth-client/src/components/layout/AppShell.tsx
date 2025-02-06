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
    <AppShell
     header={{ height: 64 }}
     padding="md" >
     <Header></Header>
     <AppShell.Main>{children || <Outlet />}</AppShell.Main>
     <Footer></Footer>
   </AppShell>
  );
};

export default Shell;
