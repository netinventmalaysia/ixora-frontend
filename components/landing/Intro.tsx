import Button from '@/components/forms/Button';

export function Intro(){
  return (
    <section id="start" className="bg-gray-50 py-20 dark:bg-gray-900">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <h2 className="text-4xl font-bold tracking-tight text-blue-700 dark:text-blue-300">Mengenali IXORA</h2>
        <p className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-200">Gerbang Digital MBMB Menuju Bandaraya Pintar</p>
        <div className="mt-8 space-y-6 text-left text-gray-600 dark:text-gray-300">
          <p className="text-base leading-relaxed">Ekosistem IXORA merupakan sebuah platform digital generasi baharu yang dibangunkan oleh Majlis Bandaraya Melaka Bersejarah (MBMB) untuk merevolusikan cara perkhidmatan kerajaan tempatan disampaikan kepada orang ramai.</p>
          <p className="text-base leading-relaxed">Dibina dengan pendekatan berteraskan komuniti, IXORA menjadikan interaksi dengan pihak kerajaan jauh lebih mudah, cekap dan pantas berbanding kaedah tradisional. Platform menyeluruh ini menggabungkan pelbagai urusan perkhidmatan bandaraya dalam satu sistem bersepadu, sekaligus mengurangkan keperluan berurusan di jabatan atau laman web berasingan.</p>
        </div>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a href="#komponen"><Button variant="primary" size="lg">Terokai Perkhidmatan</Button></a>
          <a href="/signup"><Button variant="secondary" size="lg">Daftar Sekarang</Button></a>
        </div>
      </div>
    </section>
  );
}
