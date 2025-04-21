import { checkIfUserIsWatchingParticularEventInstance, addToWatchList, removeFromWatchList } from "@/api/functions/watchlist";
import { useAuthDisabled } from "@/hooks/hooks";
import { responseIsOk } from "@/util/apiUtils";
import { showMantineNotification } from "@/util/uiUtils";
import { EventData } from "@client/types/shared/responses";
import { Checkbox } from "@mantine/core";
import { useState } from "react";
import { useQuery } from "react-query";



interface AddToWatchlistCheckboxProps{
    event: EventData | null;
    selectedEventId: string;
  }
  

export default function AddToWatchlistCheckbox({ selectedEventId, event }: AddToWatchlistCheckboxProps){

    const baseDisabled = useAuthDisabled();
    const [isChecked, setIsChecked] = useState(false);
    const [loading, setLoading] = useState(false); 
    const checkboxDisabled = baseDisabled || loading;
    
    useQuery(
        ['checkIfUserIsWatchingParticularEventInstance', selectedEventId],
        async () => {
          return await checkIfUserIsWatchingParticularEventInstance({
            eventInstanceId: selectedEventId,
          });
        },
        {
          enabled: !!selectedEventId && !baseDisabled,
          onSuccess: (res) => {
            setIsChecked(responseIsOk(res));
          },
          onError: () => {
            setIsChecked(false);
          },
          retry: false, // <= Need this to trigger only once. should be refetched on auth change so this is so fine!
          cacheTime: 0, // NO CACHING FOR THIS SIMPLE REQ
          staleTime: 0,
          refetchOnMount: true, // Basically useEffect()
          refetchOnWindowFocus: true,
        },
      );
    
      const handleCheckboxChange = async (checked: boolean) => {
        if (baseDisabled || !selectedEventId) {
          console.error('You must be logged in to update your watchlist.');
          return;
        }
    
        setLoading(true);
        setIsChecked(checked);
    
        try {
          const res = checked
            ? await addToWatchList({
                eventInstanceId: selectedEventId,
                event: event || ({} as EventData),
              })
            : await removeFromWatchList({
                eventInstanceId: selectedEventId,
              });
    
          if (responseIsOk(res)) {
            showMantineNotification({
              message: `Event ${checked ? 'added to' : 'removed from'} your watchlist.`,
              type: 'INFO',
            });
          } else {
            showMantineNotification({
              message: `Failed to ${checked ? 'add' : 'remove'} the event.`,
              type: 'ERROR',
            });
            setIsChecked(!checked);
          }
        } catch (err) {
          console.error(err);
          showMantineNotification({
            message: `An error occurred.`,
            type: 'ERROR',
          });
          setIsChecked(!checked);
        } finally {
          setLoading(false);
        }
      };
    
      const getLabelForWatchlistCheckbox = (): string => {
        if (baseDisabled) return 'Login to add to watchlist';
        return isChecked ? 'Remove this event from watchlist' : 'Watch this event';
      };

      return(
        <Checkbox
              color="green"
              iconColor="white"
              autoContrast
              c="white"
              label={getLabelForWatchlistCheckbox()}
              labelPosition="left"
              checked={isChecked}
              disabled={checkboxDisabled}
              onChange={(event) => handleCheckboxChange(event.currentTarget.checked)}
              pos="absolute" 

              bottom="50px"
              right="80px"
            />
      );
}