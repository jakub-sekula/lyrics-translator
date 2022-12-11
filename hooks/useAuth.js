import { useState, useEffect } from "react";
import axios from "axios";
import {formatDate, isExpired} from "../lib/utils.js";



export default function useAuth(code) {
//   const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [expiresIn, setExpiresIn] = useState("");
  const [expiryTimestamp, setExpiryTimestamp] = useState("");
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
	// check session storage for expiration date
	const exp = localStorage.getItem("exp")

	if (!exp || isExpired(exp)) return localStorage.clear()
 
    setRefreshToken(localStorage.getItem("rt"));
    setExpiryTimestamp(localStorage.getItem("exp"));

  }, []);

  useEffect(() => {

    if (!code) return console.log("No code yet, returning...");
	if (refreshToken && expiryTimestamp) return console.log("Token exists, no need to fetch.")
	if (!isExpired(expiryTimestamp)) return console.log("Token not expired, no need to fetch")

    axios
      .post("http://localhost:3000/api/auth/login", {
        code,
      })
      .then((res) => {
        // setAccessToken(res.data.access_token);
        setRefreshToken(res.data.refresh_token);
        setExpiresIn(res.data.expires_in);
		setLoggedIn(true)
        localStorage.setItem("rt", res.data.refresh_token);
        window.history.pushState({}, null, "/");
      })
      .catch((e) => {
        console.log(`Error in callling api auth login: ${e}`);
        window.location = "/";
      });
  }, [code]);

  useEffect(() => {
    if (!expiresIn) return;
    const exp = Date.now() + 1000 * expiresIn;
    setExpiryTimestamp(exp);
    localStorage.setItem("exp", exp);
  }, [expiresIn]);

  useEffect(() => {
    if (!refreshToken) return console.log("Refresh token missing - returning!");
    if (!expiryTimestamp) return;
    if (Date.now() < expiryTimestamp) {
	  console.log(`Date now: ${formatDate(Date.now())}\nExpiry timestamp: ${expiryTimestamp}\nExpires at: ${formatDate(expiryTimestamp)}`)
      console.log(`Expired? ${isExpired(expiryTimestamp)}`);
      return console.log("Token still valid - returning!");
    }
    axios
      .post("http://localhost:3000/api/auth/refresh", {
        refreshToken,
      })
      .then((data) => {
        console.log(data.body);
      })
      .catch((e) => {
        console.log("kaka", e);
        // window.location = "/";
      });
  }, [refreshToken, expiryTimestamp]);

  return loggedIn;
}
