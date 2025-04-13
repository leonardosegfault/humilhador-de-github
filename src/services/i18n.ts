"use client";

import i18n, { type Resource } from "i18next";
import { initReactI18next } from "react-i18next/initReactI18next";

const resources: Resource = {
  pt: {
    translation: {
      title: "Humilhador de GitHub",
      description: "Seus projetos nem são tão bons assim...",
      support: "Apoiar",
      label: "Insira seu perfil de merda e analise",
      analyze: "Analisar",
      analyzing: "Analisando",
      placeholder: "usuario",
      errors: {
        title: "Falha ao realizar uma análise",
        try: "Tente novamente mais tarde.",
        noUser: "Você não inseriu um usuário para ser analisado!",
        notFound: "O usuário não foi encontrado.",
        timeout: "A API demorou demais para te humilhar.",
        github:
          "O estagiário do GitHub fez merda na API. Aguarde até que se estabilize.",
        unknown:
          'Um erro desconhecido ocorreu — também conhecido como "meu dev foi muito preguiçoso de especificar o motivo com precisão"',
      },
      donation: {
        title: "Gostou? Então apoie!",
        content: [
          "O Humilhador de GitHub é um projeto gratuito e de código aberto, mas que exige investimentos — a IA não é de graça!",
          "Ajude o projeto com qualquer valor no Pix e permita que outras pessoas também tenham a oportunidade de serem humilhadas.",
        ],
      },
    },
  },
  en: {
    translation: {
      title: "GitHub Humiliator",
      description: "Your projects aren't that good...",
      support: "Donate",
      label: "Insert your shitty profile and analyze it",
      analyze: "Analyze",
      analyzing: "Analyzing",
      placeholder: "user",
      errors: {
        title: "Failed to analyze",
        try: "Try again later.",
        noUser: "You didn't provide a user to be analyzed!",
        notFound: "The user was not found.",
        timeout: "API took too long to humiliate you.",
        github:
          "Some GitHub intern messed up their API. Wait until they fix it.",
        unknown:
          'An unknown error happened — AKA "my dev was too lazy to specify the reason precisely"',
      },
      donation: {
        title: "Did you like it? So donate!",
        content: [
          "GitHub Humiliator is a free and open-source project, but it needs investments — the AI is not free!",
          "Help the project with any value on Pix and let other people also be humiliated.",
        ],
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "pt",
  fallbackLng: "pt",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
