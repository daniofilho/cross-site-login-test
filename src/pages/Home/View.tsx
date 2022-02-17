import { useMemo, useState } from "react";
import type { NextPage } from "next";

import { ComponentProps } from "./types";

import { centralLoginSiteDomain } from "../../../config";

import { Container } from "./styles";

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
      <Container>
        <p>Carregando...</p>
      </Container>
    );

  if (userToken)
    return (
      <Container>
        <h2>{isCentralSite ? "Site Central" : "Site Secundário"}</h2>
        <p>Logado!</p>
        <p>
          Token: <code>{userToken}</code>
        </p>
        <button type="button" onClick={() => signOut()}>
          Sair
        </button>
      </Container>
    );

  return (
    <Container>
      <h2>{isCentralSite ? "Site Central" : "Site Secundário"}</h2>

      <section>
        <div>
          <p>Insira seu login para entrar</p>

          <input
            type="text"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />

          <button type="button" onClick={() => signIn(login)}>
            Login
          </button>
        </div>

        <div>
          <p>ou</p>
        </div>

        <div>
          <p>Faça login com:</p>
          <div id="login-with-central-div" />
        </div>
      </section>
    </Container>
  );
};
export default Component;
