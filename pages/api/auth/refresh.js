const SpotifyWebApi = require("spotify-web-api-node");

const handler = async (req, res) => {
  const refreshToken = req.body.refresh_token;

  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.SPOTIFY_REDIRECT_URI,
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    refreshToken,
  });

  spotifyApi
    .refreshAccessToken()
    .then((data) => {
      console.log("access token refreshed!");
      console.log(data.body);
      spotifyApi.setAccessToken(data.body["access_token"]);
      res.setHeader(
        "Set-Cookie",
        cookie.serialize("at", String(data.body.access_token), {
          maxAge: data.body.expires_in, // 3600 seconds = 1 hour
          path: "/",
          httpOnly: true,
          sameSite: "strict",
        })
      );
      res.status(200).send()
    })
    .catch((e) => {
      console.log(e);
      return res.status(400).send();
    });
};

export default handler;
