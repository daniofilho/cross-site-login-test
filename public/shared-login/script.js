const loginControllerClass = () => {
  let inputLoginDOM = null;
  let buttonLoginDOM = null;

  // Variáveis para controlar mensagem entre o site pai e filho
  let eventSource = null;
  let eventOrigin = null;

  const allowedOrigins = []; // Adicionar aqui as origens permitidas

  const cookieName = "SHARED-LOGIN-COOKIE-NAME";

  const load = () => {
    inputLoginDOM = document.getElementById("input-login");
    buttonLoginDOM = document.getElementById("button-login");

    // Recebe o nome do site que está tentando acessar
    window.addEventListener("message", (event) => {
      // if(!allowedOrigins.contains(event.origin)) return; // !!!!! HABILITAR EM PROD

      eventSource = event.source;
      eventOrigin = event.origin;

      if (event.data.action === "setSiteURL") {
        const siteNameDOM = document.getElementById("parent-site-name");
        if (siteNameDOM) siteNameDOM.innerHTML = event.data.param;
      }
    });
  };

  const signIn = () => {
    if (!inputLoginDOM || !buttonLoginDOM) return;

    if (!inputLoginDOM.value) return alert("Digite seu e-mail para continuar.");

    buttonLoginDOM.innerHTML = "Carregando...";

    fetch("https://api-mocks.vercel.app/api/generic/login", {
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
            document.cookie = `${cookieName}=${userToken}; path=/`;

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

  return {
    load,
    signIn,
  };
};

var loginController = null;

window.addEventListener("load", () => {
  loginController = loginControllerClass();
  loginController.load();
});
