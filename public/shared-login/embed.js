const embedControllerClass = () => {
  let embedDOM = null;

  const embedURL = "https://black-eel-98.loca.lt";

  const load = () => {
    embedDOM = document.getElementById("login-with-central-div");

    if (embedDOM) {
      const html = `
        <button type="button" class="login-width-central-button" onclick="embedController.openLoginModal()">
          Login usando Site Central
        </button>
      `;

      embedDOM.innerHTML = html;
    }
  };

  const openLoginModal = () => {
    const loginWindow = window.open(
      `${embedURL}/shared-login/index.html`,
      "Login",
      "width=450,height=500,resizable=1"
    );

    // Envia essa informação várias vezes porque nunca sabemos quando a página de fato foi carregada e está pronta para receber esta informação
    setInterval(() => {
      loginWindow.postMessage(
        {
          action: "setSiteURL",
          param: location.hostname,
        },
        embedURL
      );
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
