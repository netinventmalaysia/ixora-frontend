import Button from '@/components/forms/Button';
import { useTranslation } from '@/utils/i18n';

export function Intro(){
  const { t } = useTranslation();
  return (
    <section id="start" className="bg-gray-50 py-20 dark:bg-gray-900">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <h2 className="text-4xl font-bold tracking-tight text-blue-700 dark:text-blue-300">{t('landing.intro.heading')}</h2>
        <p className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-200">{t('landing.intro.subheading')}</p>
        <div className="mt-8 space-y-6 text-left text-gray-600 dark:text-gray-300">
          <p className="text-base leading-relaxed">{t('landing.intro.p1')}</p>
          <p className="text-base leading-relaxed">{t('landing.intro.p2')}</p>
        </div>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a href="#komponen"><Button variant="primary" size="lg">{t('landing.intro.ctaExplore')}</Button></a>
          <a href="/signup"><Button variant="secondary" size="lg">{t('landing.intro.ctaRegister')}</Button></a>
        </div>
      </div>
    </section>
  );
}
