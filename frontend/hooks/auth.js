import { useContext } from "react";
import { appContext } from "providers/AppProvider";
import Router from "next/router";

const isBrowser = () => {
  return typeof window !== "undefined";
};

export const withAuth = (WrappedComponent) => (props) => {
  const { isAuthenticated } = useContext(appContext);
  if (!isAuthenticated && isBrowser()) {
    Router.push("/login");
    return <></>;
  }
  return <WrappedComponent {...props} />;
};

export const withoutAuth = (WrappedComponent) => (props) => {
  const { isAuthenticated } = useContext(appContext);
  if (isAuthenticated && isBrowser()) {
    Router.push("/");
    return <></>;
  }

  return <WrappedComponent {...props} />;
};
