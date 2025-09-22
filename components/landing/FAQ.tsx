import { useState } from 'react';

interface QAGroup { id: string; title: string; body: string | JSX.Element; open?: boolean }

const groups: QAGroup[] = [
  { id: 'faq1', title: '1. UMUM & PENGENALAN', body: (
    <div>
      <p><strong>Apa itu IXORA?</strong> IXORA ialah ekosistem digital sehenti MBMB, bukan sekadar portal bayaran.</p><br/>
      <p><strong>Apa itu IXORA GATEWAY?</strong> Gerbang Digital MBMB untuk semua urusan rakyat/perniagaan.</p><br/>
      <p><strong>Siapa boleh guna?</strong> Individu, perniagaan, pelancong dan komuniti setempat.</p>
    </div>
  ), open: true },
  { id: 'faq2', title: '2. MANFAAT KEPADA RAKYAT & PERNIAGAAN', body: (
    <ul className="list-disc pl-4 space-y-1">
      <li>Pusat sehenti – semua perkhidmatan MBMB dalam 1 aplikasi.</li>
      <li>Akses 24/7 – melalui IXORA GATEWAY.</li>
      <li>Mudah & telus – semakan status masa nyata.</li>
      <li>Inklusif – kiosk & terminal bergerak untuk warga emas/kurang celik digital.</li>
    </ul>
  ) },
  { id: 'faq3', title: '3. PERKHIDMATAN & MODUL', body: (
    <div>
      Modul utama termasuk: Cukai Taksiran, Lesen Perniagaan, Permit Bangunan, Sewaan Gerai, Parkir, Kompaun, Lesen Haiwan, Pelan Ansuran.<br/><br/>
      <strong>Operasi dalaman:</strong> Pegawai MBMB gunakan IXORA Workspace untuk pemprosesan & kelulusan.
    </div>
  ) },
  { id: 'faq4', title: '4. KOS & PENYELENGGARAAN', body: (
    <div>
      Kos pembangunan meliputi integrasi pembayaran, MyData SSM & AI Chatbot.<br/>
      Penyelenggaraan ditanggung dalam bajet ICT tahunan MBMB.<br/>
      Tiada caj tambahan daripada MBMB untuk transaksi (caj bank/eWallet sahaja).
    </div>
  ) },
  { id: 'faq5', title: '5. KESELAMATAN & PEMATUHAN', body: (
    <div>
      IXORA guna Private Cloud MBMB, SSO, encryption, audit trail, dan mematuhi PDPA 2010 & Dasar Keselamatan ICT MBMB.
    </div>
  ) },
  { id: 'faq6', title: '6. OPERASI & KESINAMBUNGAN', body: (
    <div>
      IXORA ada Disaster Recovery Plan, backup harian, pelayan auto-skala & seni bina modular.
    </div>
  ) },
  { id: 'faq7', title: '7. KPI & PRESTASI', body: (
    <div>
      KPI: ≥95% kutipan digital, ≥80% permohonan online, ≤7 hari proses lesen baharu, ≥85% kepuasan pengguna.<br/>
      Prestasi dipantau melalui Analytics Dashboard masa nyata.
    </div>
  ) },
];

export function FAQ(){
  const [openItems, setOpen] = useState(() => groups.filter(g=>g.open).map(g=>g.id));
  const toggle = (id: string) => setOpen(o => o.includes(id) ? o.filter(i=>i!==id) : [...o,id]);
  return (
    <section id="faq" className="py-20">
      <div className="mx-auto max-w-4xl px-4">
        <h2 className="mb-8 text-center text-3xl font-bold text-gray-900 dark:text-white">Soalan Lazim (FAQ) – Ekosistem Digital MBMB IXORA</h2>
        <div className="space-y-4">
          {groups.map(g => {
            const isOpen = openItems.includes(g.id);
            return (
              <div key={g.id} className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
                <button onClick={() => toggle(g.id)} className="flex w-full items-center justify-between bg-gray-50 px-4 py-3 text-left text-sm font-semibold text-gray-700 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800">
                  <span>{g.title}</span>
                  <span className="ml-4 text-xs">{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen && (
                  <div className="bg-white px-4 py-4 text-sm leading-relaxed text-gray-700 dark:bg-gray-950 dark:text-gray-300">
                    {g.body}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
