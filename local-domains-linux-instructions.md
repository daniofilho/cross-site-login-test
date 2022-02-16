# Local domains Linux Instructions

1. Abra os projetos em uma aba do terminal e em seguida execute os projetos normalmente especificando as portas:

`yarn next -p 3000`
`yarn next -p 3001`
`yarn next -p 3002`

2. Instale o localtunnel de forma global (https://localtunnel.github.io/www/)

`npm install -g localtunnel`

3. Agora abra um terminal para cada projeto e e

`lt --port 3000`
`lt --port 3001`
`lt --port 3002`

Agora você terá multiplos domínios rodando apontando para o projeto.

4. Vá no arquivo `config.ts`e configure o domínio do projeto que será o login central.

5. (Opcional em ambiente homolog) Vá no arquivo `/public/shared-cookies.html` e adicione os domínios que foram gerados para que o projeto central aceite as conexões.

Pronto.
