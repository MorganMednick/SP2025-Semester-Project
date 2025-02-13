import { Container, Center, Stack, Image, NavLink } from '@mantine/core';
import { useHover } from '@mantine/hooks';
import { IconHome } from '@tabler/icons-react';
import { fourOhFour } from '../util/assetReconcileUtil';

export default function NotFound() {
  const { hovered, ref } = useHover();
  return (
    <Center>
      <Container size="md" p="xl">
        <Stack align="center" justify="space-around" gap="xl">
          <Image src={fourOhFour} alt="404 - Not Found" w={400} maw="90%" />
          <NavLink
            href="/"
            key="Go-Home-Button"
            label={'Go Home'}
            bg="green.5"
            c="white"
            leftSection={<IconHome />}
            w="fit-content"
            active={hovered}
            ref={ref}
          />
        </Stack>
      </Container>
    </Center>
  );
}
