"use client";
import { useState } from "react";

export default function FAQ() {
  const faqSections = [
    {
      heading: "1. UMUM & PENGENALAN",
      items: [
        { q: "Apa maksud IXORA?", a: "IXORA ialah ekosistem digital sehenti MBMB ..." },
        { q: "Bagaimana IXORA berbeza?", a: "Berbeza dengan PBTPay, MelakaPay & TNG eWallet ..." },
      ],
    },
  ];

  return (
    <section id="faq" className="bg-white">
      <div className="mx-auto max-w-4xl px-6 py-20">
        <h2 className="text-center text-3xl font-bold text-gray-900">SOALAN LAZIM (FAQ)</h2>
        <div className="mt-8 space-y-8">
          {faqSections.map((section, i) => (
            <div key={i}>
              <h3 className="text-lg font-semibold text-gray-800">{section.heading}</h3>
              {section.items.map((f, j) => (
                <FAQItem key={j} q={f.q} a={f.a} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border bg-white">
      <button onClick={() => setOpen((s) => !s)} className="flex w-full items-center justify-between px-4 py-3 text-left">
        <span className="font-medium text-gray-900">{q}</span>
        <span>{open ? "▲" : "▼"}</span>
      </button>
      {open && <p className="px-4 pb-4 text-sm text-gray-600">{a}</p>}
    </div>
  );
}
