import type { NextPage } from "next";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  // Cria o controller para eventos de cross login
  const setCrossLoginController = useCallback(() => {
    if (!window.location.origin) return;

    // o tipo deveria ser HTMLIFrameElement, mas a função getElementById não está com isso declarado (mesmo retornando corretamente parao iframe)
    // Por este motivo declaro o iFrameDOM como any
    const iFrameDOM: any = document.getElementById("central-login-iframe");
    if (iFrameDOM) {
      const iframeContentWindow = iFrameDOM.contentWindow;

      if (iframeContentWindow)
        crossLoginController.current = iframeContentWindow;
    }
  }, []);

  useLayoutEffect(() => {
    setCrossLoginController();
  }, [setCrossLoginController]);

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  type CentralLoginMessage = {
    action: "signIn" | "checkLogin" | "signOut";
    param?: string;
  };
  const sendCentralLoginMessage = useCallback(
    ({ action, param }: CentralLoginMessage) => {
      if (
        crossLoginController &&
        crossLoginController.current &&
        crossLoginController.current.postMessage
      ) {
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
        // domain: "daniofilho.com.br", // especifique o domínio para garantir que sub domínios tenham acesso aos cookies também
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

  const signOut = useCallback(() => {
    removeCookie(cookieName);
    setUserToken(null);
    return sendCentralLoginMessage({
      action: "signOut",
    });
  }, [removeCookie, sendCentralLoginMessage]);

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  const checkIfUserIsLogged = useCallback(async () => {
    // Verifica internamente
    if (cookies[cookieName]) setUserToken(cookies[cookieName]);

    // envia uma chamada para o site central responder se existe algum login criado
    // mas faz isso apenas 1 vez
    if (hasCheckedCentralForLogin.current) return;

    hasCheckedCentralForLogin.current = true;
    return sendCentralLoginMessage({
      action: "checkLogin",
    });
  }, [cookies, sendCentralLoginMessage]);

  const handleCentralLoginMessage = useCallback(
    (event: MessageEvent) => {
      if (event.origin !== centralLoginSiteDomain) return; // só aceita mensagens do domínio central

      if (event.data.action === "checkLoginResponse") {
        // Se a central retornou que existe um login criado lá, então faz login aqui
        if (event.data.param) return doLogin(event.data.param);

        // caso contrário, desloga aqui também porque o usuário precisa estar logado na central também
        // Pode ser que ele tenha feito log out em outro site, então esse site aqui precisa respeitar isso e deslogar também
        return signOut();
      }
    },
    [doLogin, signOut]
  );

  useEffect(() => {
    checkIfUserIsLogged();

    window.addEventListener("message", handleCentralLoginMessage);
    return () => {
      window.removeEventListener("message", handleCentralLoginMessage);
    };
  }, [checkIfUserIsLogged, handleCentralLoginMessage]);

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  return (
    <View
      isLoading={isLoading}
      userToken={userToken}
      signIn={signIn}
      signOut={signOut}
    />
  );
};

export default Home;
