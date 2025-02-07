import { TextInput } from "@mantine/core";
import { IconSearch } from '@tabler/icons-react';

export default function SearchBar() {
    const icon = <IconSearch stroke={2} height={20} />;
    return (
        <TextInput
        leftSectionPointerEvents="none"
        leftSection={icon}
        size = "md"
        placeholder="Search for an event..." />
)}