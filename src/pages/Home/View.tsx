import { useMemo, useState } from "react";
import type { NextPage } from "next";

import { ComponentProps } from "./types";

import { centralLoginSiteDomain } from "../../../config";

import styles from "../../../styles/Home.module.css";

const Component: NextPage<ComponentProps> = ({
  isLoading,
  userToken,
  signIn,
  signOut,
}) => {
  const [login, setLogin] = useState<string>("");

  const isCentralSite = useMemo(() => {
    if (typeof window === "undefined") return false;
    return centralLoginSiteDomain === window.location.origin;
  }, []);

  if (isLoading)
    return (
      <div className={styles.container}>
        <p>Carregando...</p>
      </div>
    );

  if (userToken)
    return (
      <div className={styles.container}>
        {isCentralSite && <h2>SiteCentral</h2>}
        <p>Logado!</p>
        <p>
          Token: <code>{userToken}</code>
        </p>
        <button type="button" onClick={() => signOut()}>
          Sair
        </button>
      </div>
    );

  return (
    <div className={styles.container}>
      {isCentralSite && <h2>SiteCentral</h2>}
      <p>Insira seu login para fazer entrar</p>

      <input
        type="text"
        value={login}
        onChange={(e) => setLogin(e.target.value)}
      />

      <button type="button" onClick={() => signIn(login)}>
        Login
      </button>
    </div>
  );
};
export default Component;
