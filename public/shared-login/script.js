const getCookie = (name) => {
  var dc = document.cookie;
  var prefix = name + "=";
  var begin = dc.indexOf("; " + prefix);
  if (begin == -1) {
    begin = dc.indexOf(prefix);
    if (begin != 0) return null;
  } else {
    begin += 2;
    var end = document.cookie.indexOf(";", begin);
    if (end == -1) {
      end = dc.length;
    }
  }
  return decodeURI(dc.substring(begin + prefix.length, end));
};

const loginControllerClass = () => {
  let inputLoginDOM = null;
  let buttonLoginDOM = null;

  // Variáveis para controlar mensagem entre o site pai e filho
  let eventSource = null;
  let eventOrigin = null;

  const load = () => {
    console.log("loaded shared-login/script.js");

    inputLoginDOM = document.getElementById("input-login");
    buttonLoginDOM = document.getElementById("button-login");

    // Se já estiver logado, então apenas permite usar o login existente
    if (getCookie(COOKIE_NAME)) {
      document.body.classList.add("logged-in");
    }

    // Recebe o nome do site que está tentando acessar
    window.addEventListener("message", (event) => {
      console.log("shared-login: ", event.data); // debug

      if (!ALLOWED_ORIGINS.includes(event.origin)) return;

      console.log("shared-login: passou pela validação de segurança");

      eventSource = event.source;
      eventOrigin = event.origin;

      // Só agora libera o loading da página
      document.body.classList.add("loaded");

      if (event.data.action === "setSiteURL") {
        const siteNameDOM = document.getElementById("parent-site-name");
        if (siteNameDOM) siteNameDOM.innerHTML = event.data.param;

        // Avisa para o script que enviou essa informação de que ela foi recebida
        eventSource.postMessage(
          {
            action: "siteURLReceived",
            param: null,
          },
          eventOrigin
        );
      }
    });
  };

  const signIn = () => {
    if (!inputLoginDOM || !buttonLoginDOM) return;

    if (!inputLoginDOM.value) return alert("Digite seu e-mail para continuar.");

    buttonLoginDOM.innerHTML = "Carregando...";

    fetch(`${API_URL}/generic/login`, {
      method: "POST",
      body: JSON.stringify({
        email: inputLoginDOM,
      }),
    })
      .then((response) => {
        response.json().then((data) => {
          if (data.Token) {
            const userToken = `${inputLoginDOM.value}_popup_${data.Token}`;

            // Faz login no site central
            document.cookie = `${COOKIE_NAME}=${userToken}; path=/`;

            // Avisa que o login foi realizado e retorna o token
            if (eventSource && eventOrigin) {
              eventSource.postMessage(
                {
                  action: "sucessLoggedIn",
                  param: userToken,
                },
                eventOrigin
              );
            }

            window.close();
          }
        });
      })
      .finally(() => {
        buttonLoginDOM.innerHTML = "Login";
      });
  };

  const signInWithPreviousToken = () => {
    // Avisa que o login foi realizado e retorna o token
    if (eventSource && eventOrigin) {
      eventSource.postMessage(
        {
          action: "sucessLoggedIn",
          param: getCookie(COOKIE_NAME),
        },
        eventOrigin
      );
    }

    window.close();
  };

  return {
    load,
    signIn,
    signInWithPreviousToken,
  };
};

var loginController = null;

window.addEventListener("load", () => {
  loginController = loginControllerClass();
  loginController.load();
});
