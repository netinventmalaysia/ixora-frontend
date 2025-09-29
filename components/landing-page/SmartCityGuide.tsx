"use client";

import Link from "next/link";
import { 
  BuildingLibraryIcon,
  BoltIcon,
  MapPinIcon,
  CloudIcon,
  HeartIcon,
  MapIcon,
  BuildingStorefrontIcon,
  WifiIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "@/utils/i18n";

const PRIMARY = "#B01C2F";

interface CityCard {
  title: string;
  desc: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  href: string;
  status?: "coming-soon";
}

export default function SmartCityGuide() {
  const { t } = useTranslation();

  const cityCards: CityCard[] = [
    { title: t("city.publicToilets.title", "Toilet Awam"), desc: t("city.publicToilets.desc", "Lokasi, waktu operasi & penarafan kebersihan."), icon: BuildingLibraryIcon, href: "/city/public-toilets" },
    { title: t("city.evChargers.title", "Pengecas EV"), desc: t("city.evChargers.desc", "Senarai & status pengecas terdekat."), icon: BoltIcon, href: "/city/ev-chargers" }, // pastikan page ini wujud
    { title: t("city.parking.title", "Parkir"), desc: t("city.parking.desc", "Maklumat zon parkir, kadar & teguran."), icon: MapPinIcon, href: "/city/parking" },
    { title: t("city.environment.title", "Sensor Alam Sekitar"), desc: t("city.environment.desc", "Kualiti udara, cuaca & indeks UV."), icon: CloudIcon, href: "/city/environment-sensors" },
    { title: t("city.firstAid.title", "Balai Pertolongan Cemas"), desc: t("city.firstAid.desc", "Lokasi klinik, farmasi & AED berdekatan."), icon: HeartIcon, href: "/city/first-aid" },
    { title: t("city.touristInfo.title", "Info Pelancong & Warisan"), desc: t("city.touristInfo.desc", "Pusat maklumat, mercu tanda & jejak warisan."), icon: MapIcon, href: "/city/tourist-info" },
    { title: t("city.markets.title", "Pasar & Penjaja"), desc: t("city.markets.desc", "Pasar malam, medan selera & waktu operasi."), icon: BuildingStorefrontIcon, href: "/city/markets" },
    { title: t("city.wifi.title", "Wi-Fi Awam"), desc: t("city.wifi.desc", "Capaian internet awam & lokasi hotspot."), icon: WifiIcon, href: "/city/public-wifi" },
  ];

  return (
    <section id="city" className="bg-white">
      <div className="mx-auto max-w-screen-2xl px-6 py-20">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          {t("city.heading", "Panduan Bandaraya Pintar")}
        </h2>
        <p className="mt-2 text-center text-gray-600">
          {t("city.subtitle", "Maklumat rasmi MBMB untuk warga & pelawat")}
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6">
          {cityCards.map((c) => {
            const isDisabled = c.status === "coming-soon";
            return (
              <div
                key={c.title}
                className={`group relative rounded-2xl p-5 border transition ${
                  isDisabled
                    ? "bg-gray-100 border-gray-300 cursor-not-allowed opacity-70"
                    : "bg-white hover:shadow-md focus-within:ring-2 focus-within:ring-[#B01C2F]/30"
                }`}
                style={{ borderColor: isDisabled ? "#D1D5DB" : PRIMARY }}
              >
                {/* Stretched link: buat seluruh kad boleh diklik bila tidak disabled */}
                {!isDisabled && (
                  <Link
                    href={c.href}
                    className="absolute inset-0"
                    aria-label={c.title}
                  />
                )}

                <div className="flex items-start gap-3">
                  <div
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border"
                    style={{
                      background: isDisabled ? "#F3F4F6" : "#FFF1F2",
                      color: isDisabled ? "#9CA3AF" : PRIMARY,
                      borderColor: isDisabled ? "#D1D5DB" : PRIMARY,
                    }}
                  >
                    <c.icon className="h-6 w-6" />
                  </div>

                  <div>
                    <h3 className={`font-semibold ${isDisabled ? "text-gray-500" : "text-gray-900"}`}>
                      {c.title}
                    </h3>
                    <p className={`mt-1 text-xs ${isDisabled ? "text-gray-400" : "text-gray-600"}`}>
                      {c.desc}
                    </p>
                    {/* {!isDisabled && (
                      <span className="relative z-[1] mt-2 inline-block text-xs font-medium text-[#B01C2F] group-hover:underline">
                        {t("city.cta", "Lihat peta & lokasi →")}
                      </span>
                    )} */}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}