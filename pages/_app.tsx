import "../styles/globals.css";
import type { AppProps } from "next/app";

import { centralLoginSiteDomain } from "../config";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
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
