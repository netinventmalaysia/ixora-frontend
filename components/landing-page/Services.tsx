"use client";
import {
  HomeModernIcon,
  DocumentTextIcon,
  BuildingOffice2Icon,
  TicketIcon,
  DocumentCheckIcon,
  Square3Stack3DIcon,
  ShieldCheckIcon,
  MapPinIcon,
  BuildingStorefrontIcon,
  HeartIcon,
  CalendarDaysIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";

const PRIMARY = "#B01C2F";

const serviceCards = [
  { title: "Cukai Taksiran Harta", desc: "Semak & bayar dengan mudah.", icon: HomeModernIcon, href: "/services/assessment" },
  { title: "Lesen Perniagaan", desc: "Daftar atau renew lesen perniagaan.", icon: DocumentTextIcon, href: "/services/licence" },
  { title: "Sewaan Gerai", desc: "Urus sewaan & invois dengan digital.", icon: BuildingOffice2Icon, href: "/services/booth" },
  { title: "Kompaun & Saman", desc: "Semakan & bayaran kompaun/saman trafik.", icon: TicketIcon, href: "/services/compound" },
  { title: "Permit Bangunan Sementara (Kelulusan Pelan)", desc: "Permohonan & pembaharuan permit sementara.", icon: DocumentCheckIcon, href: "/services/myskb" },
  { title: "Pindah Milik Harta", desc: "Proses pindah milik cukai harta.", icon: Square3Stack3DIcon, href: "#", status: "coming-soon" },
  { title: "Suntikan Typhoid", desc: "Rekod suntikan & status kesihatan.", icon: ShieldCheckIcon, href: "#", status: "coming-soon" },
  { title: "Sewaan Petak Letak Kereta", desc: "Permohonan sewaan petak letak kereta.", icon: MapPinIcon, href: "#", status: "coming-soon" },
  { title: "Bil Pelbagai", desc: "Semakan & bayaran pelbagai bil MBMB.", icon: DocumentTextIcon, href: "#", status: "coming-soon" },
  { title: "Kebenaran Merancang Terhad (DO terhad)", desc: "Permohonan DO terhad secara digital.", icon: DocumentCheckIcon, href: "#", status: "coming-soon" },
  { title: "Remisi Cukai", desc: "Pengurangan cukai taksiran.", icon: HomeModernIcon, href: "#", status: "coming-soon" },
  { title: "Pas Bulanan Letak Kereta", desc: "Langganan parkir bulanan.", icon: TicketIcon, href: "#", status: "coming-soon" },
  { title: "Permit Penjaja", desc: "Daftar & urus lesen penjaja.", icon: BuildingStorefrontIcon, href: "#", status: "coming-soon" },
  { title: "Lesen Haiwan Peliharaan", desc: "Daftar & renew lesen haiwan.", icon: HeartIcon, href: "#", status: "coming-soon" },
  { title: "Permit Sementara", desc: "Kelulusan sementara untuk aktiviti.", icon: DocumentCheckIcon, href: "#", status: "coming-soon" },
  { title: "Pelan Ansuran Cukai", desc: "Bayar cukai ikut pelan ansuran.", icon: CalendarDaysIcon, href: "#", status: "coming-soon" },
  { title: "Lesen Beca", desc: "Permohonan & pembaharuan lesen beca.", icon: TruckIcon, href: "#", status: "coming-soon" },
];

export default function Services() {
  return (
    <section id="services" className="bg-gray-50">
      <div className="mx-auto max-w-screen-2xl px-6 py-20">
        <h2 className="text-center text-3xl font-bold text-gray-900">Modul Perkhidmatan</h2>
        <p className="mt-2 text-center text-gray-600">
          Urus perkhidmatan MBMB secara digital, mudah & telus
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {serviceCards.map((s) => (
            <a
              key={s.title}
              href={s.href}
              className="relative rounded-2xl bg-white border p-5 shadow-sm hover:shadow-md transition group"
            >
              {/* Badge "Coming Soon" */}
              {s.status === "coming-soon" && (
                <span className="absolute top-3 right-3 rounded bg-gray-200 px-2 py-0.5 text-[10px] font-medium text-gray-600">
                  Coming Soon
                </span>
              )}

              <div
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl mb-3"
                style={{ background: "linear-gradient(135deg,#B01C2F20,#FFF1F2)" }}
              >
                <s.icon className="h-6 w-6" />
              </div>
              <h3 className="text-base font-semibold text-gray-900">{s.title}</h3>
              <p className="mt-1 text-sm text-gray-600">{s.desc}</p>
              {s.status !== "coming-soon" && (
                <button className="mt-3 text-xs font-medium text-[#B01C2F] hover:underline">
                  Buka →
                </button>
              )}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
