"use client";

import { LoaderCircle } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { useTranslation } from "react-i18next";

export default function UserInput({ isLoading }: { isLoading?: boolean }) {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");

  function handleInput(e: ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    if (!value || /^(?!-)[A-Za-z0-9-]+(?!-)$/.test(value)) {
      setUsername(value);
    }
  }

  return (
    <div className="text-center">
      <label className="text-zinc-600 select-none" htmlFor="username">
        {t("label")}
      </label>
      <div className="flex mt-4 px-6 py-2 gap-2 w-xs items-center border border-zinc-200 bg-white rounded-4xl text-xl">
        <label className="text-zinc-600 select-none" htmlFor="username">
          github.com/
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
          className="w-full outline-none"
          placeholder={t("placeholder")}
          disabled={isLoading}
        />
      </div>

      {isLoading ? (
        <button
          disabled
          className="mt-4 flex gap-4 w-full py-2 items-center justify-center rounded-4xl font-medium bg-zinc-700 text-zinc-200"
        >
          <LoaderCircle className="size-6 animate-spin" />
          {t("analyzing")}
        </button>
      ) : (
        <button
          type="submit"
          className="mt-4 w-full py-2 transition-transform hover:scale-110 shadow rounded-4xl font-medium bg-green-600 text-white cursor-pointer"
        >
          {t("analyze")}
        </button>
      )}
    </div>
  );
}
