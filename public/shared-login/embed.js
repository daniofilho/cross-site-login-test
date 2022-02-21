const CENTRAL_DOMAIN = "https://teste.daniofilho.com.br";

const embedControllerClass = () => {
  let embedDOM = null;
  let siteURLReceivedFromModal = false;

  const load = () => {
    console.log("loaded shared-login/embed.js");

    embedDOM = document.getElementById("login-with-central-div");

    console.log({ embedDOM });

    if (embedDOM) {
      const html = `
        <button type="button" class="login-width-central-button" onclick="embedController.openLoginModal()">
          Login usando Site Central
        </button>
      `;

      embedDOM.innerHTML = html;
    }

    // Recebe o nome do site que está tentando acessar
    window.addEventListener("message", (event) => {
      console.log("shared-login:embed: ", event.data); // debug

      if (event.origin !== CENTRAL_DOMAIN) return;

      console.log("shared-login:embed: passou pela validação de segurança");

      if (event.data.action === "siteURLReceived") {
        siteURLReceivedFromModal = true;
      }
    });
  };

  const openLoginModal = () => {
    const loginWindow = window.open(
      `${CENTRAL_DOMAIN}/shared-login.html`,
      "Login",
      "width=450,height=500,resizable=1"
    );

    siteURLReceivedFromModal = false;

    // Envia essa informação várias vezes porque nunca sabemos quando a página de fato foi carregada e está pronta para receber esta informação
    const attemptsToSendSiteURL = setInterval(() => {
      console.log(
        "shared-login:embed: enviando setSiteURL: " + location.hostname
      );

      loginWindow.postMessage(
        {
          action: "setSiteURL",
          param: location.hostname,
        },
        CENTRAL_DOMAIN
      );

      if (siteURLReceivedFromModal) clearInterval(attemptsToSendSiteURL);
    }, 2000);
  };

  return {
    load,
    openLoginModal,
  };
};

var embedController = null;

window.addEventListener("load", () => {
  embedController = embedControllerClass();
  embedController.load();
});
