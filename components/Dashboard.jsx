import React, { useState } from "react";
import Album from "../components/Album";
import SearchBar from "../components/SearchBar";
import axios from "axios";
import { Button, Text, SimpleGrid, Flex, SegmentedControl } from "@mantine/core";
import { useAuth } from "./contexts/AuthContext";
let _ = require("lodash")

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [trackData, setTrackData] = useState();
  const { logout } = useAuth();

  const [term, setTerm] = useState("long_term")

  const getTopArtists = async () => {
    const res = await axios.get(`http://localhost:3000/api/top-tracks?term=${term}`);
    return setData(res.data);
  };

  const searchTracks = async (query) => {
	console.log("Sending api request to search tracks!")
    const res = await axios.get(
      `http://localhost:3000/api/search-tracks?name=${query}`
    );
    return setData(res.data);
  };

  const getTrackData = async (id) => {
    const res = await axios.get(
      `http://localhost:3000/api/get-track?id=${id}`
    );
    return setTrackData(res.data);
  }

  return (
    <>
      <Text>You're logged in</Text>
      <Flex gap="md">
        <Button
          color="green"
          radius="xl"
          size="lg"
          onClick={() => {
            logout();
          }}
        >
          Logout
        </Button>
        <Button
          color="green"
          radius="xl"
          size="lg"
          onClick={() => {
            getTopArtists(),200}}
        >
          Show my top tracks
        </Button>
      </Flex>
      <SegmentedControl
      value={term}
      onChange={setTerm}
      data={[
        { label: 'Short', value: 'short_term' },
        { label: 'Medium', value: 'medium_term' },
        { label: 'Long', value: 'long_term' },
      ]}
    />
      <SearchBar searchTracks={_.debounce(searchTracks,250)} />
      {trackData ? <pre>{JSON.stringify(trackData, null, 5)}</pre> : null}
      {/* {data ? <pre>{JSON.stringify(data, null, "\t")}</pre> : null} */}
      <SimpleGrid cols={3} w="100%">
        {data.length
          ? data.map((item) => {
              return (
                <Album
                  artist={item["album"]["artists"][0]["name"]}
                  title={item["name"]}
                  image={item["album"]["images"][1]["url"]}
                  id={item["id"]}
                  key={item["id"]}
                  link={item['external_urls']['spotify']}
                  getTrackData={getTrackData}
                />
              );
            })
          : null}
      </SimpleGrid>
    </>
  );
}
