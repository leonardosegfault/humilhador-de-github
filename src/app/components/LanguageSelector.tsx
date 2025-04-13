"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import "@/services/i18n";
import { useTranslation } from "react-i18next";

export default function LanguageSelector() {
  const { i18n } = useTranslation();
  const available: { code: string; text: string }[] = [
    {
      code: "pt",
      text: "🇧🇷 Português",
    },
    {
      code: "en",
      text: "🇺🇸 English",
    },
  ];
  const [language, setLanguage] = useState<string | null>(null);

  useEffect(() => {
    if (language) return;

    const savedLanguage = localStorage.getItem("lng");
    if (savedLanguage) {
      setLanguage(savedLanguage);

      // Gambiarra para alterar no próximo tick, já que o hook não funciona no mesmo instante
      setTimeout(() => i18n.changeLanguage(savedLanguage));
    }
  }, [i18n, language]);

  function handleChange(e: ChangeEvent<HTMLSelectElement>): void {
    const language = e.currentTarget.value;
    setLanguage(language);
    i18n.changeLanguage(language);
    localStorage.setItem("lng", language);
  }

  return (
    <select
      value={language ?? undefined}
      onChange={handleChange}
      className="text-zinc-600"
    >
      {available.map((v) => (
        <option value={v.code} key={v.code}>
          {v.text}
        </option>
      ))}
    </select>
  );
}
