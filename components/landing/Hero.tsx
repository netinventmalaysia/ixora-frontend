import Button from '@/components/forms/Button';
import { useTranslation } from '@/utils/i18n';
import Image from 'next/image';

export function Hero() {
  const { t } = useTranslation();
  return (
    <header className="bg-gray-50 py-16 text-center dark:bg-gray-900">
      <div className="mx-auto max-w-4xl px-4">
        <h1 className="flex flex-col items-center justify-center text-4xl font-extrabold tracking-tight text-[#B01C2F] sm:text-5xl">
          <span className="relative mb-4 inline-block h-16 w-16 sm:h-20 sm:w-20">
            <Image src="/images/logo.png" alt="IXORA Logo" fill sizes="(max-width: 640px) 64px, 80px" className="object-contain" priority />
          </span>
          <span>{t('landing.hero.title')}</span>
        </h1>
        <p className="mt-4 text-xl font-medium text-gray-700 dark:text-gray-200">{t('landing.hero.subtitle')}</p>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{t('landing.hero.tagline')}</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a href="#start">
            <Button variant="danger" size="lg" className="bg-[#B01C2F] hover:bg-[#951325]">{t('landing.hero.ctaPrimary')}</Button>
          </a>
          <a href="#hubungi">
            <Button variant="secondary" size="lg" className="border-gray-300 text-gray-900 dark:text-gray-100">{t('landing.hero.ctaSecondary')}</Button>
          </a>
        </div>
      </div>
    </header>
  );
}
