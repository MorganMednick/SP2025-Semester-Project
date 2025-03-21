import { TextInput, Combobox, useCombobox } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import {  useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebouncedValue } from "@mantine/hooks";
import { useQuery } from 'react-query';
import { fetchTicketMasterEvents } from '../../api/functions/ticketMaster';
import { TicketMasterQueryResponse } from '@shared/api/responses';
import { TicketMasterSearchParams } from '@shared/api/external/ticketMaster';
import { useGeoPoint } from '../../hooks/hooks';

interface SearchProps {
  width?: number;
  size?: string;
}

export default function SearchBar({ width, size }: SearchProps) {
  const icon = <IconSearch stroke={2} height={20} />;
  const navigate = useNavigate();
  const { geoPoint } = useGeoPoint();
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebouncedValue(query, 400);
  const combobox = useCombobox();

  const searchParams = useMemo<TicketMasterSearchParams>(
    () => ({
      keyword: debouncedQuery || '',
      geoPoint: geoPoint || '',
    }),
    [debouncedQuery, geoPoint],
  );

  const isQueryEnabled = Boolean(searchParams.keyword && geoPoint); 

  const { data } = useQuery<TicketMasterQueryResponse, Error>(
    ['ticketMasterEvents', searchParams],
    async () => {
      const res = await fetchTicketMasterEvents(searchParams);
      console.log(res?.data)
      return res?.data || [];
    },
    {
      enabled: isQueryEnabled,
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 30,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  );

  return (
    <Combobox
      store={combobox}
      withinPortal={false}
      offset={0}
      onOptionSubmit={(val) => {
        setQuery(val);
        navigate(`/search/${val}`);
        combobox.closeDropdown();
      }}
    >
      <Combobox.Target>
        <TextInput
          leftSection={icon}
          size={size}
          w={width}
          placeholder="Search for an event..."
          onChange= {(event) => {
            setQuery((event.target as HTMLInputElement).value);
            combobox.openDropdown();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const value = (e.target as HTMLInputElement).value;
              navigate(`/search/${value}`);
              combobox.closeDropdown();
            }
          }}
        />
      </Combobox.Target> 
      <Combobox.Dropdown hidden={(data?.length?? 0) <= 0}>
          <Combobox.Options mah={300} style={{ overflowY: 'auto' }}>
          {data?.map((item) => (
              <Combobox.Option value={item.eventName} key={item.eventName}>
                {item.eventName}
              </Combobox.Option>
            ))}
          </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>    
  );
}
