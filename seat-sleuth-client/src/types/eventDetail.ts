import { SpecificEventData } from '@shared/api/responses';

export interface EventDetailsChildProps {
  selectedOption: SpecificEventData;
  setSelectedOption: React.Dispatch<React.SetStateAction<SpecificEventData>>;
}
