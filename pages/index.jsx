import { Button, Flex, Container} from "@mantine/core";
import Link from "next/link";
import { GetServerSideProps } from "next";
// import useAuth from "../hooks/useAuth";
import { useAuth } from "../components/contexts/AuthContext";
import { useEffect, useState } from "react";
const querystring = require("node:querystring");
import Dashboard from "../components/Dashboard"

const cookie = require("cookie");

export default function Home({ auth_url, token, code }) {
  const { loggedIn, setCode } = useAuth();
 
  // pass authorization code from query to auth context if available
  useEffect(() => {
    if (!code) return;
    setCode(code);
  }, [code]);

  return (
    <Container size="lg">
      <Flex
        mih="100vh"
        p="xl"
        gap="md"
        justify="center"
        align="center"
        direction="column"
      >
        {loggedIn ? (
          <Dashboard />
        ) : (
          <>
            <Link href={auth_url}>
              <Button color="green" radius="xl" size="lg">
                Log in with Spotify
              </Button>
            </Link>
          </>
        )}
      </Flex>
    </Container>
  );
}

export const getServerSideProps = async (ctx) => {
  const code = ctx.query.code ? ctx.query.code : null;
  const scopes = "user-read-private user-read-email user-top-read";
  const state = "7r3hfe7rg234fg3f67437vb";

  const token = ctx.req.headers.cookie
    ? cookie.parse(ctx.req.headers.cookie)["at"]
    : null;

  const AUTH_URL =
    "https://accounts.spotify.com/authorize?" +
    querystring.stringify({
      response_type: "code",
      client_id: process.env.SPOTIFY_CLIENT_ID,
      scope: scopes,
      redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
      state: state,
    });
  return {
    props: {
      auth_url: AUTH_URL,
      token: token,
      code: code,
    },
  };
};
