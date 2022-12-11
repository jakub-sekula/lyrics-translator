import { TextInput, TextInputProps } from "@mantine/core";
import { IconSearch } from "@tabler/icons";
import axios from "axios";
import { useState } from "react";

export default function SearchBar({searchTracks, ...props}) {
  const [value, setValue] = useState("");

  const handleChange = async (e) => {
    setValue(e.target.value);
    searchTracks(e.target.value)
    return;
  };

  return (
    <TextInput
      icon={<IconSearch size={18} stroke={1.5} />}
      radius="xl"
      size="lg"
      placeholder="Search songs"
      value={value}
      onChange={(e) => {
        handleChange(e);
      }}
      {...props}
    />
  );
}
