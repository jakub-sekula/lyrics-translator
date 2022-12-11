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

  spotifyApi.setAccessToken(token);

  console.log(req.query.id)

  spotifyApi
    .getAudioFeaturesForTrack(req.query.id)
    .then((data) => {
      let search_results = data.body;
      // console.log(search_results)
      return res.status(200).json(search_results);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500);
    });
};

export default handler;

export const config = {
  api: {
    externalResolver: true,
  },
};
