"use client";

import { Github, HandCoins } from "lucide-react";
import Link from "next/link";
import LanguageSelector from "./LanguageSelector";
import { useTranslation } from "react-i18next";

export default function Navbar() {
  const { t } = useTranslation();

  return (
    <nav className="p-4 md:flex text-center justify-between">
      <div className="mb-4">
        <LanguageSelector />
      </div>

      <ul className="w-full h-4 flex gap-8 justify-center md:justify-end font-bold text-zinc-600 select-none">
        <li>
          <Link href="https://livepix.gg/leosegfault" className="flex gap-1">
            <HandCoins /> {t("support")}
          </Link>
        </li>
        <li>
          <Link
            href="https://github.com/leonardosegfault/humilhador-de-github"
            className="flex gap-1"
          >
            <Github /> GitHub
          </Link>
        </li>
      </ul>
    </nav>
  );
}
