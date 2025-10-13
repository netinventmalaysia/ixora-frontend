"use client";

import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import { useMemo, useState } from "react";
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
import { useTranslation } from "@/utils/i18n";

const PRIMARY = "#B01C2F";

export type ServiceCard = {
  title: string;
  desc: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  href: string;
  status?: "coming-soon";
};

/** Centralised list so landing + full page can share the same data */
export const ALL_SERVICES = (t: ReturnType<typeof useTranslation>["t"]): ServiceCard[] => [
  { title: t("services.assessment.title","Assessment Tax"), desc: t("services.assessment.desc","Check & pay easily."), icon: HomeModernIcon, href: "/services/assessment" },
  { title: t("services.licence.title","Business Licence"), desc: t("services.licence.desc","Register or renew your licence."), icon: DocumentTextIcon, href: "/services/licence" },
  { title: t("services.booth.title","Booth Rental"), desc: t("services.booth.desc","Manage rentals & invoices digitally."), icon: BuildingOffice2Icon, href: "/services/booth" },
  { title: t("services.compound.title","Compounds"), desc: t("services.compound.desc","Check and pay compounds."), icon: TicketIcon, href: "/services/compound" },
  { title: t("services.myskb.title","Temporary Building Permit"), desc: t("services.myskb.desc","Apply & renew temporary permits."), icon: DocumentCheckIcon, href: "/services/myskb" },
  { title: t("services.transfer.title","Property Ownership Transfer"), desc: t("services.transfer.desc","Process assessment tax ownership transfer."), icon: Square3Stack3DIcon, href: "#", status: "coming-soon" },
  { title: t("services.typhoid.title","Typhoid Injection"), desc: t("services.typhoid.desc","Record injections & health status."), icon: ShieldCheckIcon, href: "#", status: "coming-soon" },
  { title: t("services.parkingRental.title","Parking Bay Rental"), desc: t("services.parkingRental.desc","Apply for parking bay rental."), icon: MapPinIcon, href: "#", status: "coming-soon" },
  { title: t("services.miscBills.title","Miscellaneous Bills"), desc: t("services.miscBills.desc","Check & pay MBMB miscellaneous bills."), icon: DocumentTextIcon, href: "/services/misc" },
  { title: t("services.doLimited.title","Limited Planning Order"), desc: t("services.doLimited.desc","Apply digitally for limited."), icon: DocumentCheckIcon, href: "#", status: "coming-soon" },
  { title: t("services.taxRemission.title","Tax Remission"), desc: t("services.taxRemission.desc","Reduction of assessment tax."), icon: HomeModernIcon, href: "#", status: "coming-soon" },
  { title: t("services.facilityBooking.title","Facility Booking"), desc: t("services.facilityBooking.desc","Book halls, fields & courts."), icon: CalendarDaysIcon, href: "/services/facility-booking", status: "coming-soon" },
  { title: t("services.monthlyParking.title","Monthly Parking Pass"), desc: t("services.monthlyParking.desc","Subscribe to monthly parking."), icon: TicketIcon, href: "#", status: "coming-soon" },
  { title: t("services.hawker.title","Hawker Permit"), desc: t("services.hawker.desc","Register & manage hawker permits."), icon: BuildingStorefrontIcon, href: "#", status: "coming-soon" },
  { title: t("services.petLicence.title","Pet Licence"), desc: t("services.petLicence.desc","Register & renew pet licences."), icon: HeartIcon, href: "#", status: "coming-soon" },
  { title: t("services.tempPermit.title","Temporary Permit"), desc: t("services.tempPermit.desc","Temporary approvals for permits."), icon: DocumentCheckIcon, href: "#", status: "coming-soon" },
  { title: t("services.installmentPlan.title","Installment Plan"), desc: t("services.installmentPlan.desc","Pay your bills via installments."), icon: CalendarDaysIcon, href: "#", status: "coming-soon" },
  { title: t("services.trishaw.title","Trishaw Licence"), desc: t("services.trishaw.desc","Apply & renew trishaw licences."), icon: TruckIcon, href: "#", status: "coming-soon" },
];

function ServiceTile({ s }: { s: ServiceCard }) {
  const disabled = s.status === "coming-soon";
  return (
    <Link
      href={disabled ? "#" : s.href}
      aria-disabled={disabled}
      className={`relative block rounded-2xl p-5 border transition focus:outline-none ${
        disabled
          ? "bg-gray-100 border-gray-300 cursor-not-allowed opacity-70"
          : "bg-white hover:shadow-md focus-visible:ring-2 focus-visible:ring-[#B01C2F]/30"
      }`}
      style={{ borderColor: disabled ? "#D1D5DB" : PRIMARY }}
    >
      <div className="flex items-start gap-3">
        <div
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border"
          style={{
            background: disabled ? "#F3F4F6" : "#FFF1F2",
            color: disabled ? "#9CA3AF" : PRIMARY,
            borderColor: disabled ? "#D1D5DB" : PRIMARY,
          }}
        >
          <s.icon className="h-6 w-6" />
        </div>
        <div className="min-w-0">
          <h3 className={`font-semibold truncate ${disabled ? "text-gray-500" : "text-gray-900"}`}>
            {s.title}
          </h3>
          <p className={`mt-1 text-xs ${disabled ? "text-gray-400" : "text-gray-600"}`}>
            {s.desc}
          </p>
          {/* {disabled && (
            <span className="mt-2 inline-block rounded-full bg-gray-200 px-2 py-0.5 text-[10px] font-medium text-gray-600">
              Coming soon
            </span>
          )} */}
        </div>
      </div>
    </Link>
  );
}

/** Full-services listing (used by /services) */
export default function ServicesListPage() {
  const { t } = useTranslation();
  const [q, setQ] = useState("");

  const services = useMemo(() => ALL_SERVICES(t), [t]);

  const filtered = useMemo(() => {
    const k = q.trim().toLowerCase();
    if (!k) return services;
    return services.filter(
      (s) =>
        s.title.toLowerCase().includes(k) ||
        s.desc.toLowerCase().includes(k)
    );
  }, [q, services]);

  return (
    <main className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t("services.heading", "Service Modules")}
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            {t("services.subtitle", "Manage MBMB services digitally easy & transparent")}
          </p>
        </div>
        <Link
          href="/"
          className="rounded-lg border px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          ←
        </Link>
      </div>

      {/* Search */}
      <div className="mt-6">
        <label className="sr-only" htmlFor="service-search">
          {t("common.search", "Search")}
        </label>
        <input
          id="service-search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("services.searchPlaceholder", "Search services...")}
          className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[#B01C2F] focus:ring-2 focus:ring-[#B01C2F]/20"
        />
      </div>

      {/* Grid */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6">
        {filtered.map((s) => (
          <ServiceTile key={s.title} s={s} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-10 text-center text-sm text-gray-500">
          {t("services.noResult", "No services match your search.")}
        </p>
      )}
    </main>
  );
}