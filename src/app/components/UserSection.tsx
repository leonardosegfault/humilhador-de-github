"use client";

import { useState, FormEvent } from "react";
import UserInput from "./UserInput";

export default function UserSection() {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [text, setText] = useState("");
  const [avatar, setAvatar] = useState("");
  const [name, setName] = useState("");

  async function handleSubmit(e: FormEvent) {
    const data = new FormData(e.target as HTMLFormElement);
    const username = data.get("username");
    let tempText = "";
    let length = 0;

    e.preventDefault();

    setText("");
    setError("");
    setLoading(true);

    try {
      let res = await fetch("https://api.github.com/users/" + username);
      if (res.status != 200) {
        let errMessage = "";
        if (res.status == 403) {
          errMessage =
            "Você está fazendo muitas análises e o GitHub não está gostando disso.";
        } else if (res.status == 404) {
          errMessage = "Perfil não encontrado";
        } else if (res.status == 500) {
          errMessage = "O estagiário fez merda na API do GitHub.";
        }

        throw new Error(errMessage);
      }

      const githubData = await res.json();

      setAvatar(githubData.avatar_url);
      setName(githubData.name ?? githubData.login);

      res = await fetch("/api/analyze?u=" + username);
      if (res.status != 200) {
        let errMessage = res.statusText || "HTTP Status " + res.status;

        try {
          const apiData = await res.json();
          if (apiData.error) errMessage = apiData.error;
        } catch {}

        throw new Error(errMessage);
      }
      const apiData = await res.json();

      tempText = apiData.content;
      length = tempText.length;
    } catch (e) {
      setText("");
      setError(
        (e as Error).message ||
          'Um erro desconhecido ocorreu — também conhecido como "meu desenvolvedor foi muito preguiçoso em não especificar o erro".'
      );
      setLoading(false);

      console.error(e);

      return;
    }

    const int = setInterval(() => {
      if (length < 0) {
        clearInterval(int);
        setLoading(false);
        return;
      }

      setText(tempText.slice(0, tempText.length - length--));
    }, 30);
  }

  return (
    <section>
      <form className="w-fit mx-auto" onSubmit={handleSubmit}>
        <UserInput isLoading={isLoading} />
      </form>

      {error && (
        <div className="mt-10 p-4 w-sm md:w-lg break-words rounded-lg bg-red-100 border border-red-500 text-red-500">
          <h3 className="font-bold">Falha ao realizar uma análise</h3>
          <p className="my-2">{error}</p>
          <p className="my-2">Tente novamente mais tarde.</p>
        </div>
      )}

      {text && (
        <div className="mt-10 p-4 w-sm md:w-lg break-words rounded-lg bg-linear-to-br from-lime-100 to-green-200">
          <div className="*:mx-auto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatar}
              alt="avatar"
              className="size-32 rounded-full bg-gray-50 select-none"
            />

            <h2 className="text-center text-xl font-bold">{name}</h2>
          </div>

          {text.split("\n").map((v, i) => (
            <p className="w-full my-2" key={i}>
              {v}
            </p>
          ))}
        </div>
      )}
    </section>
  );
}
