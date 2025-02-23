import { TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

interface SearchProps {
  width?: number;
  size?: string;
}

export default function SearchBar({ width, size }: SearchProps) {
  const icon = <IconSearch stroke={2} height={20} />;
  const navigate = useNavigate();

  return (
    <TextInput
      leftSectionPointerEvents="none"
      leftSection={icon}
      size={size}
      w={width}
      placeholder="Search for an event..."
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          const value = (e.target as HTMLInputElement).value;
          navigate(`/search/${value}`);
        }
      }}
    />
  );
}
