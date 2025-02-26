import { Stack } from '@mantine/core';
import About from '../components/home/About';
import PopularNearYou from '../components/home/PopularNearYou';

export default function Home() {
  return (
    <Stack>
      <About />
      <meta
        name="description"
        content="Discover popular places near you and learn more about us."
      />
      <PopularNearYou />
    </Stack>
  );
}
