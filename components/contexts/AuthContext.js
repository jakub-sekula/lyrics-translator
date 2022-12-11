import React, { createContext, useEffect, useState } from "react";
import { formatDate, isExpired } from "../../lib/utils";
import axios from "axios";
import { useRouter } from "next/router";

const AuthContext = createContext({
  loggedIn: false,
  setCode: (code) => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [refreshToken, setRefreshToken] = useState("");
  const [expiresIn, setExpiresIn] = useState("");
  const [expiryTimestamp, setExpiryTimestamp] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [code, setCode] = useState("");
  const router = useRouter()

  const logout = () => {
    axios.post("http://localhost:3000/api/auth/logout");
    localStorage.clear();
    setRefreshToken(null);
    setExpiryTimestamp(0);
    setLoggedIn(false);
  };

  useEffect(() => {
    // check session storage for expiration date
    const exp = localStorage.getItem("exp");

    if (!exp || isExpired(exp)) return localStorage.clear();

    setRefreshToken(localStorage.getItem("rt"));
    setExpiryTimestamp(localStorage.getItem("exp"));
  }, []);

  useEffect(() => {
    if (!code) return
    
    if (refreshToken && expiryTimestamp && !isExpired(expiryTimestamp)) {
      setLoggedIn(true);
      return console.log("Token exists, no need to fetch.");
    }

    axios
      .post("http://localhost:3000/api/auth/login", {
        code,
      })
      .then((res) => {
        setRefreshToken(res.data.refresh_token);
        setExpiresIn(res.data.expires_in);
        setLoggedIn(true);
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
    if (!refreshToken || !expiryTimestamp) return;

    if (!isExpired(expiryTimestamp)) {
      setLoggedIn(true);
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

  return (
    <AuthContext.Provider
      value={{
        loggedIn,
        setCode,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => React.useContext(AuthContext);
export const AuthConsumer = AuthContext.Consumer;
