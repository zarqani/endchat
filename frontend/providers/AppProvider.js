import { createContext, useState, useEffect } from "react";
import { destroyCookie } from "nookies";
// import { getMyInfo } from "@/root/api/auth";

export const appContext = createContext({
  isAuthenticated: false,
  setAuthenticated: () => {},
  userInfo: null,
  setUserInfo: () => {},
});

export const AppProvider = (props) => {
  const [isAuthenticated, setAuthenticated] = useState(props.authenticated);
  const [userInfo, setUserInfo] = useState(props.userInfo);

  useEffect(() => {
    if (!isAuthenticated) {
      destroyCookie(null, "token", {
        path: "/",
      });
      setUserInfo(null);
    }
  }, [isAuthenticated]);

  return (
    <appContext.Provider
      value={{
        isAuthenticated,
        setAuthenticated,
        userInfo,
        setUserInfo,
      }}
    >
      {props.children}
    </appContext.Provider>
  );
};
