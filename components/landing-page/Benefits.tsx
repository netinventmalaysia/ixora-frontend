"use client";
import { useTranslation } from "@/utils/i18n";

const PRIMARY = "#B01C2F";

export default function Benefits() {
  const { t } = useTranslation();

  const items = [
    { k: "oneStop", icon: "🏛️" },
    { k: "access", icon: "🕒" },
    { k: "counterless", icon: "📲" },
    { k: "transparent", icon: "🔎" },
    { k: "dataDriven", icon: "📊" },
    { k: "secure", icon: "🔐" },
  ];

  return (
    <section id="benefits" className="bg-white">
      <div className="mx-auto max-w-screen-2xl px-6 py-20">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          {t("landing.benefits.title")}
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:gap-6">
          {items.map(({ k, icon }) => (
            <div key={k} className="group rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md">
              <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl" style={{ backgroundColor: "#FFF1F2", color: PRIMARY }}>
                {icon}
              </div>
              <h3 className="text-base font-semibold text-gray-900">{t(`landing.benefits.items.${k}.title`)}</h3>
              <p className="mt-1 text-sm text-gray-600">{t(`landing.benefits.items.${k}.desc`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
