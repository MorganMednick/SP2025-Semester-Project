import { Container } from '@mantine/core';
import { ReactNode } from 'react';

interface PageLayoutProps {
  children: ReactNode;
}
export default function PageLayout({ children }: PageLayoutProps) {
  return <Container py="xl">{children}</Container>;
}
