"use client";

import UserSection from "./components/UserSection";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation();

  return (
    <main className="mt-20 text-zinc-800">
      <div>
        <h1 className="text-center text-6xl font-bold select-none">
          {t("title")}
        </h1>
        <p className="mt-2 text-2xl text-center text-zinc-700">
          {t("description")}
        </p>
      </div>

      <div className="w-fit mt-20 mx-auto">
        <UserSection />
      </div>
    </main>
  );
}
