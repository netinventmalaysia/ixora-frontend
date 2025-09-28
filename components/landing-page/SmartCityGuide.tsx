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

const PRIMARY = "#B01C2F";

export default function SmartCityGuide() {
  const cityCards = [
    { title: "Toilet Awam", desc: "Lokasi, waktu operasi & penarafan kebersihan.", icon: BuildingLibraryIcon, href: "/city/public-toilets" },
    { title: "Pengecas EV", desc: "Senarai & status pengecas terdekat.", icon: BoltIcon, href: "/city/ev-chargers" },
    { title: "Parkir & Kawasan Larangan", desc: "Maklumat zon parkir, kadar & teguran.", icon: MapPinIcon, href: "/city/parking" },
    { title: "Sensor Alam Sekitar", desc: "Kualiti udara, cuaca & indeks UV.", icon: CloudIcon, href: "/city/environment-sensors" },
    { title: "Balai Pertolongan Cemas", desc: "Lokasi klinik, farmasi & AED berdekatan.", icon: HeartIcon, href: "/city/first-aid" },
    { title: "Hotspot Banjir", desc: "Titik kerap banjir & aras air semasa.", icon: ExclamationTriangleIcon, href: "/city/flood-hotspots" },
    { title: "Laluan Selamat & CCTV", desc: "Laluan pejalan kaki selamat & titik CCTV.", icon: VideoCameraIcon, href: "/city/safe-routes-cctv" },
    { title: "Info Pelancong & Warisan", desc: "Pusat maklumat, mercu tanda & jejak warisan.", icon: MapIcon, href: "/city/tourist-info" },
    { title: "Acara & Festival", desc: "Kalendar acara komuniti & perbandaran.", icon: CalendarDaysIcon, href: "/city/events" },
    { title: "Pasar & Penjaja", desc: "Pasar malam, medan selera & waktu operasi.", icon: BuildingStorefrontIcon, href: "/city/markets" },
    { title: "Wi-Fi Awam", desc: "Capaian internet awam & lokasi hotspot.", icon: WifiIcon, href: "/city/public-wifi" },
    { title: "Kutipan Sisa & Kitar Semula", desc: "Jadual kutipan, pusat kitar semula & 3R.", icon: TrashIcon, href: "/city/waste-recycling" },
    { title: "Amaran Bencana", desc: "Notifikasi cuaca buruk & arahan keselamatan.", icon: ShieldCheckIcon, href: "/city/disaster-alerts" },
    { title: "Trafik & Kerja Jalan", desc: "Notis kerja jalan & pengalihan trafik terpilih.", icon: TruckIcon, href: "/city/traffic-roadworks" },
  ];

  return (
    <section id="city" className="bg-gray-50 py-16">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 2xl:px-10">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Panduan Bandaraya Pintar
          </h2>
          <p className="mt-2 text-gray-600">
            Maklumat rasmi MBMB untuk warga & pelawat
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6">
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
                    Lihat peta & lokasi →
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
