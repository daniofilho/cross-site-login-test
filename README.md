# Cross site login test

Projeto criado para testar login automático entre sites de diferentes domínios.

## Instruções para rodar diferentes domínios de forma local

1. Abra os projetos em uma aba do terminal e em seguida execute-os normalmente especificando as portas:

`yarn next -p 3000`
`yarn next -p 3001`
`yarn next -p 3002`

2. Instale o localtunnel de forma global (https://localtunnel.github.io/www/):

`npm install -g localtunnel`

3. Agora abra um terminal para cada projeto e execute:

`lt --port 3000`
`lt --port 3001`
`lt --port 3002`

Agora você terá multiplos domínios rodando apontando para o projeto.

4. Vá nos arquivos `config.ts` e `public/shared-login/embed.js` e configure o domínio do projeto que será o login central.

5. (Caso esteja em produção) Vá nos arquivos `/public/shared-cookies.html` e `public/shared-login/script.js` e adicione os domínios que foram gerados para que o projeto central aceite as conexões.

Tudo pronto para os testes.
