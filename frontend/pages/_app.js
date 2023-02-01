import { useEffect } from "react";
import { getCurrentUser } from "api/auth";
import App from "next/app";
import { parseCookies } from "nookies";
import { AppProvider } from "providers/AppProvider";
import { configSocket } from "socket/socket";
import "../styles/style.less";

function MyApp({ data, Component, pageProps }) {
  useEffect(() => {
    if (data.authenticated) {
      configSocket(data.token);
    }
  });

  return (
    <>
      <main>
        <div className="container">
          <AppProvider
            authenticated={data.authenticated}
            userInfo={data.userData}
          >
            <Component {...pageProps} />
          </AppProvider>
        </div>
      </main>
    </>
  );
}

MyApp.getInitialProps = async (appContext) => {
  const { req } = appContext.ctx;
  let authenticated = false;
  let userData = null;
  let token = null;

  if (req) {
    const cookies = parseCookies({ req });
    authenticated = !!cookies.token;
    token = cookies.token;
    if (authenticated) {
      const res = await getCurrentUser({
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }).catch(() => null);
      userData = res?.data ? res.data : null;
      configSocket(token);
    }
  }

  const appProps = await App.getInitialProps(appContext);

  return {
    ...appProps,
    data: {
      token,
      authenticated,
      userData,
    },
  };
};

export default MyApp;
