// components/landing-page/Services.tsx
"use client";

import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
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

type ServiceCard = {
  title: string;
  desc: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  href: string;
  status?: "coming-soon";
};

export default function Services() {
  const { t } = useTranslation();

  const serviceCards: ServiceCard[] = [
    { title: t("services.assessment.title", "Assessment Tax"), desc: t("services.assessment.desc", "Check & pay easily."), icon: HomeModernIcon, href: "/services/assessment" },
    { title: t("services.licence.title", "Business Licence"), desc: t("services.licence.desc", "Register or renew your licence."), icon: DocumentTextIcon, href: "/services/licence" },
    { title: t("services.booth.title", "Booth Rental"), desc: t("services.booth.desc", "Manage rentals & invoices digitally."), icon: BuildingOffice2Icon, href: "/services/booth" },
    { title: t("services.compound.title", "Compounds & Fines"), desc: t("services.compound.desc", "Check and pay traffic compounds/fines."), icon: TicketIcon, href: "/services/compound" },
    { title: t("services.myskb.title", "Temporary Building Permit"), desc: t("services.myskb.desc", "Apply & renew temporary permits."), icon: DocumentCheckIcon, href: "/services/myskb" },
    { title: t("services.transfer.title", "Property Ownership Transfer"), desc: t("services.transfer.desc", "Process assessment tax ownership transfer."), icon: Square3Stack3DIcon, href: "#", status: "coming-soon" },
    { title: t("services.typhoid.title", "Typhoid Injection"), desc: t("services.typhoid.desc", "Record injections & health status."), icon: ShieldCheckIcon, href: "#", status: "coming-soon" },
    { title: t("services.parkingRental.title", "Parking Bay Rental"), desc: t("services.parkingRental.desc", "Apply for parking bay rental."), icon: MapPinIcon, href: "#", status: "coming-soon" },
    { title: t("services.miscBills.title", "Miscellaneous Bills"), desc: t("services.miscBills.desc", "Check & pay MBMB miscellaneous bills."), icon: DocumentTextIcon, href: "#", status: "coming-soon" },
    { title: t("services.doLimited.title", "Limited Planning Order"), desc: t("services.doLimited.desc", "Apply digitally for limited."), icon: DocumentCheckIcon, href: "#", status: "coming-soon" },
    { title: t("services.taxRemission.title", "Tax Remission"), desc: t("services.taxRemission.desc", "Reduction of assessment tax."), icon: HomeModernIcon, href: "#", status: "coming-soon" },
    { title: t("services.monthlyParking.title", "Monthly Parking Pass"), desc: t("services.monthlyParking.desc", "Subscribe to monthly parking."), icon: TicketIcon, href: "#", status: "coming-soon" },
    { title: t("services.hawker.title", "Hawker Permit"), desc: t("services.hawker.desc", "Register & manage hawker permits."), icon: BuildingStorefrontIcon, href: "#", status: "coming-soon" },
    { title: t("services.petLicence.title", "Pet Licence"), desc: t("services.petLicence.desc", "Register & renew pet licences."), icon: HeartIcon, href: "#", status: "coming-soon" },
    { title: t("services.tempPermit.title", "Temporary Permit"), desc: t("services.tempPermit.desc", "Temporary approvals for activities."), icon: DocumentCheckIcon, href: "#", status: "coming-soon" },
    { title: t("services.installmentPlan.title", "Assessment Installment Plan"), desc: t("services.installmentPlan.desc", "Pay your tax via installments."), icon: CalendarDaysIcon, href: "#", status: "coming-soon" },
    { title: t("services.trishaw.title", "Trishaw Licence"), desc: t("services.trishaw.desc", "Apply & renew trishaw licences."), icon: TruckIcon, href: "#", status: "coming-soon" },
  ];

  return (
    <section id="services" className="bg-gray-50 py-16">
      <div className="mx-auto max-w-screen-2xl px-6 py-20">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          {t("services.heading", "Service Modules")}
        </h2>
        <p className="mt-2 text-center text-gray-600">
          {t("services.subtitle", "Manage MBMB services digitally — easy & transparent")}
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6">
          {serviceCards.map((s) => {
            const isDisabled = s.status === "coming-soon";
            return (
              <Link
                key={s.title}
                href={isDisabled ? "#" : s.href}
                className={`relative rounded-2xl p-5 border transition block ${
                  isDisabled
                    ? "bg-gray-100 border-gray-300 cursor-not-allowed opacity-70"
                    : "bg-white hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B01C2F]/30"
                }`}
                style={{ borderColor: isDisabled ? "#D1D5DB" : PRIMARY }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border"
                    style={{
                      background: isDisabled ? "#F3F4F6" : "#FFF1F2",
                      color: isDisabled ? "#9CA3AF" : PRIMARY,
                      borderColor: isDisabled ? "#D1D5DB" : PRIMARY,
                    }}
                  >
                    <s.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className={`font-semibold ${isDisabled ? "text-gray-500" : "text-gray-900"}`}>
                      {s.title}
                    </h3>
                    <p className={`mt-1 text-xs ${isDisabled ? "text-gray-400" : "text-gray-600"}`}>
                      {s.desc}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}