import { TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

interface SearchProps {
  width?: number;
  size?: string;
}

export default function SearchBar({ width, size }: SearchProps) {
  const icon = <IconSearch stroke={2} height={20} />;
  return (
    <TextInput
      leftSectionPointerEvents="none"
      leftSection={icon}
      size={size}
      w={width}
      placeholder="Search for an event..."
    />
  );
}
