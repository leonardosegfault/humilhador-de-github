import { useTranslation } from "react-i18next";

export default function ErrorMessage({ error }: { error: string }) {
  const { t } = useTranslation();

  return (
    <div className="mt-10 p-4 w-sm md:w-lg break-words rounded-lg bg-red-100 border border-red-500 text-red-500">
      <h3 className="font-bold">{t("errors.title")}</h3>
      <p className="my-2">{error}</p>
      <p className="my-2">{t("errors.try")}</p>
    </div>
  );
}
