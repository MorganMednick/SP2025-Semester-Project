import { Stack } from '@mantine/core';
import About from '../components/home/About';
import PopularNearYou from '../components/home/PopularNearYou';

export default function Home() {
  return (
    <Stack>
      <About />
      <PopularNearYou />
    </Stack>
  );
}
