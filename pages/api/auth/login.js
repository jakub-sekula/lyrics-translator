const SpotifyWebApi = require("spotify-web-api-node");
const cookie = require("cookie");

const handler = async (req, res) => {
  const code = req.body.code;
  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.SPOTIFY_REDIRECT_URI,
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  });

  spotifyApi
    .authorizationCodeGrant(code)
    .then((data) => {
      console.log(data.body)
      res.setHeader("Set-Cookie", [
        cookie.serialize("at", data.body.access_token, {
          maxAge: data.body.expires_in, // 3600 seconds = 1 hour
          path: "/",
          httpOnly: true,
          sameSite: "strict",
        }),
      ]);
      return res.status(200).json({
        access_token: data.body.access_token,
        refresh_token: data.body.refresh_token,
        expires_in: data.body.expires_in,
      });
    })
    .catch((e) => {
      console.log(e);
      return res.status(400).send("chuj");
    });
};

export default handler;
