import Button from '@/components/forms/Button';
import Image from 'next/image';

// components/landing/Hero.tsx
import { useTranslation } from '@/utils/i18n';

export function Hero() {
  const { t } = useTranslation();
  return (
    <section id="hero" className="bg-white dark:bg-slate-900">
      <div className="mx-auto grid max-w-7xl px-4 md:px-6 lg:grid-cols-12 gap-10 py-20 md:py-28">
        <div className="lg:col-span-6 place-self-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight dark:text-white">
            {t('landing.hero.title', 'Modern city services, simplified.')}
          </h1>
          <p className="mt-4 text-slate-600 dark:text-slate-300 md:text-lg">
            {t('landing.hero.subtitle', 'Pay bills, manage permits, and track applications in one secure portal.')}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <a href="/app" className="inline-flex items-center justify-center rounded-lg bg-purple-700 px-5 py-3 font-medium text-white hover:bg-purple-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple-300 dark:focus-visible:ring-purple-800">
              {t('cta.getStarted', 'Get started')}
            </a>
            <a href="#features" className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-5 py-3 font-medium hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
              {t('cta.exploreFeatures', 'Explore features')}
            </a>
          </div>
          {/* trust indicators */}
          <div className="mt-8 grid grid-cols-3 gap-6 text-sm text-slate-500 dark:text-slate-400">
            <div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">98.9%</div>
              {t('trust.uptime','Uptime')}
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">150k+</div>
              {t('trust.users','Transactions')}
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">ISO</div>
              {t('trust.security','Security ready')}
            </div>
          </div>
        </div>
        <div className="lg:col-span-6">
          <div className="relative mx-auto w-full max-w-xl aspect-[4/3] md:aspect-[16/9] rounded-xl ring-1 ring-slate-200 dark:ring-slate-800 overflow-hidden">
            <Image
              src="/images/mascot.png"
              alt={t('landing.hero.imageAlt','IXORA dashboard preview')}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 90vw, 700px"
            />
          </div>
        </div>
      </div>
    </section>
  );
}