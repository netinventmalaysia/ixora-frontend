"use client";

import Link from "next/link";
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  BuildingOffice2Icon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";

const PRIMARY = "#B01C2F";
const PRIMARY_HOVER = "#951325";

export default function Contact() {
  const addressLine1 = "Menara MBMB";
  const addressLine2 = "Jalan Graha Makmur, Ayer Keroh, 75450 Melaka";
  const tel = "+606-xxxx xxxx"; // edit to real number
  const email = "ixora@mbmb.gov.my";

  const googleMapsUrl =
    "https://www.google.com/maps/search/?api=1&query=Menara+MBMB,+Jalan+Graha+Makmur,+Ayer+Keroh,+Melaka";

  return (
    <section id="contact" className="bg-gray-50 py-16">
      <div className="mx-auto max-w-screen-2xl px-6 py-20">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          Hubungi Kami
        </h2>
        <p className="mt-2 text-center text-gray-600">
          Saluran rasmi MBMB untuk pertanyaan, maklum balas & sokongan
        </p>

        {/* Top grid: Address / Phone & Email / Hours */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:gap-6">
          {/* Address */}
          <div
            className="rounded-2xl bg-white p-6 border hover:shadow-md transition"
            style={{ borderColor: PRIMARY }}
          >
            <div className="flex items-start gap-3">
              <div
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border"
                style={{
                  background: "#FFF1F2",
                  color: PRIMARY,
                  borderColor: PRIMARY,
                }}
              >
                <BuildingOffice2Icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Alamat</h3>
                <p className="mt-1 text-sm text-gray-600">
                  {addressLine1}
                  <br />
                  {addressLine2}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium text-white"
                    style={{ backgroundColor: PRIMARY }}
                  >
                    Buka Peta
                    <ArrowTopRightOnSquareIcon className="ml-1 h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Phone / Email */}
          <div
            className="rounded-2xl bg-white p-6 border hover:shadow-md transition"
            style={{ borderColor: PRIMARY }}
          >
            <div className="flex items-start gap-3">
              <div
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border"
                style={{
                  background: "#FFF1F2",
                  color: PRIMARY,
                  borderColor: PRIMARY,
                }}
              >
                <PhoneIcon className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-gray-900">
                  Telefon & Emel
                </h3>
                <div className="mt-2 space-y-1 text-sm">
                  <p className="text-gray-600">
                    Telefon:{" "}
                    <a
                      href={`tel:${tel.replace(/[^+\d]/g, "")}`}
                      className="text-gray-900 underline decoration-transparent hover:decoration-inherit"
                    >
                      {tel}
                    </a>
                  </p>
                  <p className="text-gray-600">
                    Emel:{" "}
                    <a
                      href={`mailto:${email}`}
                      className="text-gray-900 underline decoration-transparent hover:decoration-inherit"
                    >
                      {email}
                    </a>
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-start gap-3">
              <div
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border"
                style={{
                  background: "#FFF1F2",
                  color: PRIMARY,
                  borderColor: PRIMARY,
                }}
              >
                <EnvelopeIcon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  Untuk maklum balas pantas, sila gunakan emel rasmi di atas.
                </p>
              </div>
            </div>
          </div>

          {/* Hours & Panel */}
          <div
            className="rounded-2xl bg-white p-6 border hover:shadow-md transition"
            style={{ borderColor: PRIMARY }}
          >
            <div className="flex items-start gap-3">
              <div
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border"
                style={{
                  background: "#FFF1F2",
                  color: PRIMARY,
                  borderColor: PRIMARY,
                }}
              >
                <ClockIcon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Waktu Operasi</h3>
                <ul className="mt-2 text-sm text-gray-600">
                  <li>Isnin – Jumaat: 8.00 pagi – 5.00 petang</li>
                  <li>Sabtu & Ahad: Tutup</li>
                  <li>Cuti Umum: Tutup</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 rounded-md border p-4">
              <h4 className="font-semibold text-gray-900">Panel IXORA</h4>
              <p className="mt-1 text-sm text-gray-600">
                Daftar untuk akses penuh modul perkhidmatan.
              </p>
              <div className="mt-3 flex gap-2">
                <a
                  href="#"
                  className="rounded-md px-3 py-1.5 text-sm text-white"
                  style={{ backgroundColor: PRIMARY }}
                >
                  Register
                </a>
                <Link
                  href="/login"
                  className="rounded-md border px-3 py-1.5 text-sm text-gray-800 hover:border-gray-400"
                >
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Map embed */}
        <div className="mt-8 overflow-hidden rounded-2xl border shadow-sm">
          <div className="relative">
            <iframe
              title="Lokasi MBMB"
              className="h-[380px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              // Google Maps embed (no API key needed for a place search)
              src={`https://www.google.com/maps?q=${encodeURIComponent(
                `${addressLine1}, ${addressLine2}`
              )}&output=embed`}
            />
            <div className="absolute bottom-3 right-3">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md bg-white/90 px-3 py-1.5 text-xs font-medium text-gray-900 shadow hover:bg-white"
                style={{ border: `1px solid ${PRIMARY}` }}
              >
                Buka di Google Maps
              </a>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <a
            href={`tel:${tel.replace(/[^+\d]/g, "")}`}
            className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-white"
            style={{ backgroundColor: PRIMARY }}
          >
            <PhoneIcon className="h-4 w-4" />
            Call
          </a>
          <a
            href={`mailto:${email}`}
            className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium text-gray-800 hover:border-gray-400"
          >
            <EnvelopeIcon className="h-4 w-4" />
            Email
          </a>
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium text-gray-800 hover:border-gray-400"
          >
            <MapPinIcon className="h-4 w-4" />
            Directions
          </a>
        </div>
      </div>

      <style jsx global>{`
        a[href^="tel:"],
        a[href^="mailto:"] {
          word-break: break-word;
        }
        .btn-primary:hover {
          background-color: ${PRIMARY_HOVER};
        }
      `}</style>
    </section>
  );
}