**Humilhador de GitHub** é um website que utiliza de inteligência artificial para analisar seu perfil do GitHub e resumi-lo sarcasticamente.

## Desenvolvimento

1. Clone o repositório;
2. Instale as dependências com `npm install`;
3. Clone o arquivo [`.env.example`](.env.example) e preencha as variáveis de ambiente;

   - `OPENAI_API_KEY` é sua chave para o uso da API da OpenAI; ([openai](https://platform.openai.com/))
   - `UPSTASH_REDIS_REST_URL` e `UPSTASH_REDIS_REST_TOKEN` são opcionais e se referem ao caching de perfis e rate-limiting. ([upstash](https://upstash.com/))

4. Rode o servidor local de desenvolvimento com `npm run dev`;
5. Sucesso!

Em caso de contribuição, atente-se à formatação dos códigos. O projeto faz uso do [ESLint](https://eslint.org/) e [Prettier](https://prettier.io/).
