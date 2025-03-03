import { Container } from '@mantine/core';
import { ReactNode } from 'react';

interface PageLayoutProps {
  children: ReactNode;
}
export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <Container fluid p="xl">
      {children}
    </Container>
  );
}
