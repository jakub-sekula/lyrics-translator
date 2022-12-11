const SpotifyWebApi = require("spotify-web-api-node");
const cookie = require("cookie");

const spotifyApi = new SpotifyWebApi({
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

const handler = async (req, res) => {
  let token = req.headers.cookie
    ? cookie.parse(req.headers?.cookie)["at"]
    : null;

  let term = req.query.term ? req.query.term : "short_term"

  console.log(token);

  spotifyApi.setAccessToken(token);

  spotifyApi
    .getMyTopTracks({ limit: 10, time_range: term })
    .then((data) => {
      let topTracks = data.body.items;
      res.status(200).json(topTracks);
      console.log(topTracks);
    })
    .catch((err) => console.log(err));
};

export default handler;

export const config = {
  api: {
    externalResolver: true,
  },
};
