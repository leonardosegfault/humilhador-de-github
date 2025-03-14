"use client";

import { LoaderCircle } from "lucide-react";
import { ChangeEvent, useState } from "react";

export default function UserInput({ isLoading }: { isLoading?: boolean }) {
  const [username, setUsername] = useState("");

  function handleInput(e: ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    if (!value || /^(?!-)[A-Za-z0-9-]+(?!-)$/.test(value)) {
      setUsername(value);
    }
  }

  return (
    <>
      <label
        className="text-center text-zinc-700 select-none"
        htmlFor="username"
      >
        Insira seu perfil de merda e analise
      </label>
      <div className="w-2xs px-2 pr-0 flex gap-2 items-center rounded-lg border border-gray-300 text-xl bg-white">
        <label className="font-bold select-none" htmlFor="username">
          @
        </label>
        <input
          type="text"
          name="username"
          id="username"
          value={username}
          minLength={2}
          maxLength={39}
          onChange={handleInput}
          pattern="^(?!-)[A-Za-z0-9\-]+(?!-)$"
          className="w-full h-full py-1 rounded-lg bg-white outline-none"
          placeholder="usuario"
          disabled={isLoading}
        />
      </div>

      {isLoading ? (
        <button
          type="submit"
          className="mt-2 w-full py-1 flex gap-2 justify-center items-center rounded-lg bg-zinc-600 text-white"
        >
          <LoaderCircle className="size-4 animate-spin" />
          Analisando
        </button>
      ) : (
        <button
          type="submit"
          className="mt-2 w-full py-1 transition-transform hover:scale-110 hover:-rotate-3 rounded-lg bg-green-600 text-white cursor-pointer"
        >
          Analisar
        </button>
      )}
    </>
  );
}
