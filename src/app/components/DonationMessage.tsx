import "@/services/i18n";
import { useTranslation } from "react-i18next";

export default function DonationMessage() {
  const { t } = useTranslation();

  return (
    <div className="mt-10 p-4 w-sm md:w-xl break-words rounded-lg bg-blue-100 text-blue-500">
      <h3 className="text-blue-600 font-bold">{t("donation.title")}</h3>
      <p>{t("donation.content.0")}</p>
      <p className="mt-2">{t("donation.content.1")}</p>

      <div className="w-full mt-2 text-right">
        <a
          href="https://livepix.gg/leosegfault"
          className="p-1 px-4 bg-blue-500 text-base rounded-lg text-white"
        >
          {t("support")}
        </a>
      </div>
    </div>
  );
}
