import Button from '@/components/forms/Button';

export function Hero() {
  return (
    <header className="bg-gray-50 py-16 text-center dark:bg-gray-900">
      <div className="mx-auto max-w-4xl px-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-[#B01C2F] sm:text-5xl">IXORA</h1>
        <p className="mt-4 text-xl font-medium text-gray-700 dark:text-gray-200">Tadbir Urus Lebih Pintar, Komuniti Lebih Lancar</p>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Dibina dengan Kepercayaan · Dikuasakan oleh MBMB · Diilhamkan untuk Anda</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a href="#start">
            <Button variant="danger" size="lg" className="bg-[#B01C2F] hover:bg-[#951325]">Mula Urusan Digital</Button>
          </a>
          <a href="#hubungi">
            <Button variant="secondary" size="lg" className="border-gray-300 text-gray-900 dark:text-gray-100">Muat Turun Aplikasi IXORA+</Button>
          </a>
        </div>
      </div>
    </header>
  );
}
