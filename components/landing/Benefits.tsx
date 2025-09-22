import { useTranslation } from '@/utils/i18n';

const benefitKeys = [
  { icon: '🧩', key: 'oneStop' },
  { icon: '⏱️', key: 'access' },
  { icon: '🙋‍♂️', key: 'counterless' },
  { icon: '👁️', key: 'transparent' },
  { icon: '📊', key: 'dataDriven' },
  { icon: '🔐', key: 'secure' },
];

export function Benefits() {
  const { t } = useTranslation();
  return (
    <section id="manfaat" className="bg-gray-50 py-16 dark:bg-gray-900">
      <div className="mx-auto max-w-6xl px-4 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{t('landing.benefits.title')}</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {benefitKeys.map(b => (
            <div key={b.key} className="group rounded-lg border border-gray-200 bg-white p-6 text-left shadow-sm transition dark:border-gray-800 dark:bg-gray-800">
              <div className="text-3xl">{b.icon}</div>
              <h3 className="mt-4 text-lg font-semibold text-gray-800 dark:text-white">{t(`landing.benefits.items.${b.key}.title`)}</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{t(`landing.benefits.items.${b.key}.desc`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
