"use client";

import { 
  BuildingLibraryIcon,
  BoltIcon,
  MapPinIcon,
  CloudIcon,
  HeartIcon,
  ExclamationTriangleIcon,
  VideoCameraIcon,
  MapIcon,
  CalendarDaysIcon,
  BuildingStorefrontIcon,
  WifiIcon,
  TrashIcon,
  ShieldCheckIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "@/utils/i18n";
import { JSX } from "react";

const PRIMARY = "#B01C2F";

interface CityCard {
  title: string;
  desc: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  href: string;
}

export default function SmartCityGuide() {
  const { t } = useTranslation();

  const cityCards: CityCard[] = [
    { title: t("city.publicToilets.title", "Toilet Awam"), desc: t("city.publicToilets.desc", "Lokasi, waktu operasi & penarafan kebersihan."), icon: BuildingLibraryIcon, href: "/city/public-toilets" },
    { title: t("city.evChargers.title", "Pengecas EV"), desc: t("city.evChargers.desc", "Senarai & status pengecas terdekat."), icon: BoltIcon, href: "/city/ev-chargers" },
    { title: t("city.parking.title", "Parkir"), desc: t("city.parking.desc", "Maklumat zon parkir, kadar & teguran."), icon: MapPinIcon, href: "/city/parking" },
    { title: t("city.environment.title", "Sensor Alam Sekitar"), desc: t("city.environment.desc", "Kualiti udara, cuaca & indeks UV."), icon: CloudIcon, href: "/city/environment-sensors" },
    { title: t("city.firstAid.title", "Balai Pertolongan Cemas"), desc: t("city.firstAid.desc", "Lokasi klinik, farmasi & AED berdekatan."), icon: HeartIcon, href: "/city/first-aid" },
    // { title: t("city.floodHotspots.title", "Hotspot Banjir"), desc: t("city.floodHotspots.desc", "Titik kerap banjir & aras air semasa."), icon: ExclamationTriangleIcon, href: "/city/flood-hotspots" },
    // { title: t("city.safeRoutes.title", "Laluan Selamat & CCTV"), desc: t("city.safeRoutes.desc", "Laluan pejalan kaki selamat & titik CCTV."), icon: VideoCameraIcon, href: "/city/safe-routes-cctv" },
    { title: t("city.touristInfo.title", "Info Pelancong & Warisan"), desc: t("city.touristInfo.desc", "Pusat maklumat, mercu tanda & jejak warisan."), icon: MapIcon, href: "/city/tourist-info" },
    // { title: t("city.events.title", "Acara & Festival"), desc: t("city.events.desc", "Kalendar acara komuniti & perbandaran."), icon: CalendarDaysIcon, href: "/city/events" },
    { title: t("city.markets.title", "Pasar & Penjaja"), desc: t("city.markets.desc", "Pasar malam, medan selera & waktu operasi."), icon: BuildingStorefrontIcon, href: "/city/markets" },
    { title: t("city.wifi.title", "Wi-Fi Awam"), desc: t("city.wifi.desc", "Capaian internet awam & lokasi hotspot."), icon: WifiIcon, href: "/city/public-wifi" },
//     { title: t("city.waste.title", "Kutipan Sisa & Kitar Semula"), desc: t("city.waste.desc", "Jadual kutipan, pusat kitar semula & 3R."), icon: TrashIcon, href: "/city/waste-recycling" },
//     { title: t("city.alerts.title", "Amaran Bencana"), desc: t("city.alerts.desc", "Notifikasi cuaca buruk & arahan keselamatan."), icon: ShieldCheckIcon, href: "/city/disaster-alerts" },
//     { title: t("city.traffic.title", "Trafik & Kerja Jalan"), desc: t("city.traffic.desc", "Notis kerja jalan & pengalihan trafik terpilih."), icon: TruckIcon, href: "/city/traffic-roadworks" },
   ];

  return (
    <section id="city" className="bg-white">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 2xl:px-10">
        <div className="mx-auto max-w-screen-2xl px-6 py-20">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            {t("city.heading", "Panduan Bandaraya Pintar")}
          </h2>
          <p className="mt-2 text-center text-gray-600">
            {t("city.subtitle", "Maklumat rasmi MBMB untuk warga & pelawat")}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6">
          {cityCards.map((c) => (
            <a
              key={c.title}
              href={c.href}
              className="rounded-2xl bg-white p-5 border hover:shadow-md transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B01C2F]/30"
              style={{ borderColor: "#E5E7EB" }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ background: "#FFF1F2", color: PRIMARY }}
                >
                  <c.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{c.title}</h3>
                  <p className="mt-1 text-sm text-gray-600">{c.desc}</p>
                  <span className="mt-2 inline-block text-xs font-medium text-gray-600 group-hover:text-gray-900">
                    {t("city.cta", "Lihat peta & lokasi →")}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}