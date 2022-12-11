const SpotifyWebApi = require("spotify-web-api-node");
const cookie = require("cookie");

const handler = async (req, res) => {
  return res.setHeader(
    "Set-Cookie",
    cookie.serialize("at", null, {
      maxAge: 0,
      path: "/",
      httpOnly: true,
      sameSite: "strict",
    })
  ).status(200).send();
};

export default handler;
