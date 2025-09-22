const benefits = [
  { icon: '🧩', title: 'One-Stop Center', desc: 'Akses semua perkhidmatan dalam satu portal' },
  { icon: '⏱️', title: 'Akses 24/7', desc: 'Boleh digunakan bila-bila masa' },
  { icon: '🙋‍♂️', title: 'Tanpa Kaunter', desc: 'Bebas hadir ke kaunter fizikal' },
  { icon: '👁️', title: 'Telus', desc: 'Status & notifikasi masa nyata' },
  { icon: '📊', title: 'Data-Driven', desc: 'Analitik & dashboard pintar' },
  { icon: '🔐', title: 'Selamat', desc: 'Private Cloud MBMB' },
];

export function Benefits() {
  return (
    <section id="manfaat" className="bg-gray-50 py-16 dark:bg-gray-900">
      <div className="mx-auto max-w-6xl px-4 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Manfaat Utama</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {benefits.map(b => (
            <div key={b.title} className="group rounded-lg border border-gray-200 bg-white p-6 text-left shadow-sm transition dark:border-gray-800 dark:bg-gray-800">
              <div className="text-3xl">{b.icon}</div>
              <h3 className="mt-4 text-lg font-semibold text-gray-800 dark:text-white">{b.title}</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
