import "../styles/globals.css";
import type { AppProps } from "next/app";

import { centralLoginSiteDomain } from "../config";
import Script from "next/script";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Script src={`${centralLoginSiteDomain}/shared-login/embed.js`} />

      <iframe
        style={{ display: "none" }}
        src={`${centralLoginSiteDomain}/shared-cookies.html`}
        id="central-login-iframe"
      ></iframe>

      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
