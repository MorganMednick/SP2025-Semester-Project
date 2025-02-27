import { Flex, Stack, Text, Anchor, NativeSelect, Divider } from '@mantine/core';

// TODO

interface InfoProps {
  startTime: string | number | Date; //it wouldnt let me use optional because then matching is undefined
  venueMap?: string | null;
  venue?: string | null;
  city?: string | null;
}

export default function EventDetailsInfoSection({ startTime, venueMap, venue, city }: InfoProps) {
  const formattedDate = new Date(startTime).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div>
      <Flex direction={{ base: 'column', sm: 'row' }} align="center" mt="s" pl={50}>
        {/* Location & Section Selectors */}
        <Stack gap="xl" mt={20}>
          <NativeSelect
            label="Location"
            size="md"
            c="green.7"
            data={['Option 1', 'Option 2']}
            w={400}
            h={60}
            labelProps={{ style: { fontWeight: 'bold' } }} // Make label bold
          />
          <NativeSelect
            label="Section"
            size="md"
            c="green.7"
            data={['Option A', 'Option B']}
            w={400}
            h={60}
            labelProps={{ style: { fontWeight: 'bold' } }}
          />
        </Stack>
        <Flex direction="row" align="center" ml="auto" pr={350} gap="xl" mt={-10}>
          <Stack align="flex-end" gap="xs">
            {/* Event Date */}
            <Text size="x" tt="uppercase" ta="left">
              {formattedDate}
            </Text>
          </Stack>
          {/* Vertical Divider */}
          <Divider size="lg" color="black" orientation="vertical" h={100} />

          {/* Venue Info */}
          <Stack align="flex-start" gap={5}>
            <Text size="xxl" fw={700} ta="left">
              {city}
            </Text>
            <Text size="xl" tt="uppercase" ta="left">
              {venue}
              {venueMap && (
                <Anchor href={venueMap} target="_blank" size="xl" td="underline">
                  See map
                </Anchor>
              )}
            </Text>
          </Stack>
        </Flex>
      </Flex>
    </div>
  );
}
