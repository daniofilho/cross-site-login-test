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

// Recebe mensagem de outros domínios
window.addEventListener("message", function (event) {
  console.log("shared-cookies: ", event.data); // debug

  if (!ALLOWED_ORIGINS.includes(event.origin)) return;

  console.log("shared-cookies: passou pela validação de segurança");

  // # Salva o token de login
  if (event.data.action === "signIn") {
    document.cookie = `${COOKIE_NAME}=${event.data.param}`;
  }

  // # Faz logout
  if (event.data.action === "signOut") {
    document.cookie = `${COOKIE_NAME}=`;
  }
});

window.addEventListener("load", () => {
  console.log("loaded shared-cookies/script.js");
});
