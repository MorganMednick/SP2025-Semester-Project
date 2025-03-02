import { Container, Image, Flex, Title, Checkbox } from '@mantine/core';

interface ImageProps {
  name?: string;
  image?: string[];
}

export default function EventDetailsImageSection({ name, image }: ImageProps) {
  return (
    <>
      {image && name && (
        <Container fluid w="100%" p={0} m={0} pos="relative" mt={-25}>
          <Image src={image[0]} alt={name} width="100%" height={400} />

          <Flex
            justify="space-between"
            align="center"
            pos="absolute"
            top={310}
            left={20}
            right={20}
            p="md"
          >
            <Title
              order={1}
              style={{
                color: 'white',
                backdropFilter: 'blur(10px)',
              }}
            >
              {name}
            </Title>
            <Checkbox
              color="green"
              iconColor="white"
              label="Watch price"
              labelPosition="left"
              c="white"
            />
          </Flex>
        </Container>
      )}
    </>
  );
}
