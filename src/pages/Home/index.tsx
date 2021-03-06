import type { NextPage } from "next";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useCookies } from "react-cookie";

import { centralLoginSiteDomain } from "../../../config";
import api from "../../../utils/api";

const cookieName = "SHARED-LOGIN-COOKIE-NAME";

import View from "./View";

const Home: NextPage = () => {
  const crossLoginController = useRef<any>(null);

  const [cookies, setCookie, removeCookie] = useCookies([cookieName]);

  const [isLoading, setLoading] = useState<boolean>(false);
  const [userToken, setUserToken] = useState<string | null>(null);

  const hasCheckedCentralForLogin = useRef<boolean>(false);

  const isCentralSite = useMemo(() => {
    if (typeof window === "undefined") return false;
    return centralLoginSiteDomain === window.location.origin;
  }, []);

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  useEffect(() => {
    if (cookies[cookieName]) setUserToken(cookies[cookieName]);
  }, [cookies]);

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  type CentralLoginMessage = {
    action: "signIn" | "signOut";
    param?: string;
  };
  const sendCentralLoginMessage = useCallback(
    ({ action, param }: CentralLoginMessage) => {
      if (
        crossLoginController &&
        crossLoginController.current &&
        crossLoginController.current.postMessage
      ) {
        console.log("Home: enviando ", action, param);
        // # https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage
        return crossLoginController.current.postMessage(
          { action, param },
          centralLoginSiteDomain
        );
      }
      return null;
    },
    []
  );

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  const doLogin = useCallback(
    (paramToken: string) => {
      // Seta um cookie pra esse site
      setCookie(cookieName, paramToken, {
        path: "/",
        expires: new Date("2022-12-12"),
        // domain: "daniofilho.com.br", // especifique o dom??nio para garantir que sub dom??nios tenham acesso aos cookies tamb??m
      });

      setUserToken(paramToken);
    },
    [setCookie]
  );

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  const signIn = useCallback(
    async (login: string) => {
      setLoading(true);
      const res = await api.get("/generic/login");
      const token = res.data.Token || "NOTOKEN";
      setLoading(false);

      const userToken = `${login}_${token}`;

      // Faz login internamente
      doLogin(userToken);

      // Seta uma cookie no site central login
      return sendCentralLoginMessage({
        action: "signIn",
        param: userToken,
      });
    },
    [doLogin, sendCentralLoginMessage]
  );

  const signOut = useCallback(
    (silent?: boolean) => {
      removeCookie(cookieName);
      setUserToken(null);
      sendCentralLoginMessage({
        action: "signOut",
      });
      // Precisa atualizar a p??gina para que o bot??o de Login pela central seja reconstru??do
      if (silent) return;
      if (typeof window === "undefined") return false;
      window.location.reload();
    },
    [removeCookie, sendCentralLoginMessage]
  );

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  const handleCentralLoginMessage = useCallback(
    (event: MessageEvent) => {
      console.log("Home: ", event.data); // debug

      if (event.origin !== centralLoginSiteDomain) return; // s?? aceita mensagens do dom??nio central

      console.log("Home: passou pela valida????o de seguran??a");

      if (event.data.action === "checkLoginResponse") {
        // Se a central retornou que existe um login criado l??, ent??o faz login aqui
        if (event.data.param) return doLogin(event.data.param);

        // caso contr??rio, desloga aqui tamb??m porque o usu??rio precisa estar logado na central tamb??m
        // Pode ser que ele tenha feito log out em outro site, ent??o esse site aqui precisa respeitar isso e deslogar tamb??m
        return signOut(true);
      }

      // # Se o login foi feito o site via Popup, ent??o recebe o token e faz login dele aqui
      if (event.data.action === "sucessLoggedIn") {
        // Se a central retornou que existe um login criado l??, ent??o faz login aqui
        if (event.data.param) return doLogin(event.data.param);
      }
    },
    [doLogin, signOut]
  );

  useEffect(() => {
    window.addEventListener("message", handleCentralLoginMessage);
    return () => {
      window.removeEventListener("message", handleCentralLoginMessage);
    };
  }, [handleCentralLoginMessage]);

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  useEffect(() => {
    const iFrameDOM: any = document.getElementById("central-login-iframe");

    if (iFrameDOM && !isCentralSite) {
      const iframeContentWindow = iFrameDOM.contentWindow;

      if (iframeContentWindow)
        crossLoginController.current = iframeContentWindow;
    }
  }, [isCentralSite]);

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  return (
    <>
      <View
        isLoading={isLoading}
        userToken={userToken}
        signIn={signIn}
        signOut={signOut}
        isCentralSite={isCentralSite}
      />
    </>
  );
};

export default Home;
