import { Container, Image, Flex, Title, Checkbox } from '@mantine/core';
import { EventWithOptions } from '@shared/api/responses';
import { useState } from 'react';
import { responseIsOk } from '../../util/apiUtils';
import { checkLogin } from '../../api/functions/auth';
import { useQuery } from 'react-query';
import { set } from 'zod';

interface ImageProps {
  event: EventWithOptions;
}


  /* TODO - @Veda Fix Me with new props! */

export default function EventDetailsImageSection({ event }: ImageProps) {
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(false);

  const { isLoading, isError } = useQuery<boolean, Error>(['isLoggedIn'], async () => {
    const res = await checkLogin();
    setIsChecked(false);
    setDisabled(true);
    return Boolean(responseIsOk(res));
  });

  // const handleCheckboxChange = async (checked: boolean) => {
  //   setDisabled(true);
  //   setIsChecked(checked);
  //   if (checked) {
  //     const addToWatchListPayload: AddToWatchListPayload = {
  //       eventId: event.id,
  //       startingPrice: event.priceMin || 0.0,
  //       ticketSite: 'TICKETMASTER',
  //     };
  //     const res: ApiResponse<null> = await addToWatchList(addToWatchListPayload);
  //     if (responseIsOk(res)) {
  //       setDisabled(false);
  //     }
  //   } else {
  //     const res: ApiResponse<null> = await removeFromWatchList({ eventId: event.id });
  //     if (responseIsOk(res)) {
  //       setDisabled(false);
  //     }
  //   }
  // };

  return (
    <>
      {event && (
        <Container fluid w="100%" p={0} m={0} pos="relative" mt={-25}>
          <Image src={event.imageSrc?.[0]} alt={event.eventName} width="100%" height={400} />

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
              {event.eventName}
            </Title>
            {!isLoading && !isError ? (
              <Checkbox
                color="green"
                iconColor="white"
                label="Watch price"
                labelPosition="left"
                c="white"
                checked={isChecked}
                disabled={disabled}
                // onChange={(event) => handleCheckboxChange(event.currentTarget.checked)}
              />
            ) : (
              <Checkbox
                color="green"
                iconColor="white"
                label="Login to watch price"
                labelPosition="left"
                c="white"
                checked={false}
                disabled={true}
              />
            )}
          </Flex>
        </Container>
      )}
    </>
  );
}
