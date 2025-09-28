"use client";
import { useTranslation } from "@/utils/i18n";

const PRIMARY = "#B01C2F";

export default function ComponentsGrid() {
  const { t } = useTranslation();

  const items = [
    "Portal",
    "Mobile App",
    "AI Assistant",
    "Workspace",
    "Access",
    "NotifyMe",
    "Private Cloud",
    "Analytics",
    "Identity",
  ];

  const blurbs: Record<string, string> = {
    Portal: "Central hub for city services.",
    "Mobile App": "Services on the go.",
    "AI Assistant": "Smart help & suggestions.",
    Workspace: "Staff & department tools.",
    Access: "Single sign-on & identity.",
    NotifyMe: "Alerts & status updates.",
    "Private Cloud": "Secure MBMB infrastructure.",
    Analytics: "KPIs & dashboards.",
    Identity: "Citizen & business profiles.",
  };

  return (
    <section id="components" className="bg-white">
      <div className="mx-auto max-w-screen-2xl px-6 py-20">
        <h2 className="text-center text-3xl font-bold text-gray-900">{t("landing.components.title")}</h2>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((name) => (
            <div key={name} className="rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md">
              <div className="mb-2 text-2xl" style={{ color: PRIMARY }}>🧩</div>
              <h3 className="text-base font-semibold text-gray-900">{name}</h3>
              <p className="mt-1 text-sm text-gray-600">{blurbs[name]}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
