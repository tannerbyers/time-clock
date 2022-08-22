import { useEffect, useState } from "react";

export function useToken() {
  const getToken = () => {
    const tokenString = localStorage.getItem("token");

    const userToken = JSON.parse(tokenString);

    if (userToken) {
      return userToken.token;
    } else {
      return null;
    }
  };

  const [token, setToken] = useState(getToken());

  useEffect(() => {
    const tokenString = localStorage.getItem("token");

    const userToken = JSON.parse(tokenString);

    if (userToken) {
      setToken(userToken.token);
    } else {
      setToken(null);
    }
  }, [token]);

  const saveToken = (userToken) => {
    localStorage.setItem("token", JSON.stringify(userToken));

    setToken(userToken.token);
  };

  const clearToken = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return {
    setToken: saveToken,
    clearToken,
    token,
  };
}
