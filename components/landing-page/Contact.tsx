"use client";
const PRIMARY = "#B01C2F";

export default function Contact() {
  return (
    <section id="contact" className="bg-white">
      <div className="mx-auto max-w-screen-2xl px-6 py-20">
        <h2 className="text-center text-3xl font-bold text-gray-900">Hubungi Kami</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900">Alamat</h3>
            <p className="mt-2 text-sm text-gray-600">Menara MBMB, Jalan Graha Makmur, Ayer Keroh, Melaka</p>
          </div>
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900">Telefon / Emel</h3>
            <p className="mt-2 text-sm text-gray-600">+60 X-XXXX XXXX / ixora@mbmb.gov.my</p>
          </div>
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900">Panel IXORA</h3>
            <p className="mt-2 text-sm text-gray-600">Sila daftar untuk akses penuh</p>
            <div className="mt-4 flex gap-2">
              <a href="#" className="rounded-md px-3 py-1.5 text-sm text-white" style={{ backgroundColor: PRIMARY }}>Register</a>
              <a href="/login" className="rounded-md border px-3 py-1.5 text-sm text-gray-800">Login</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
