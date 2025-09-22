import { useTranslation } from '@/utils/i18n';

export function Footer(){
  const { t } = useTranslation();
  return (
    <footer className="bg-[#B01C2F] py-6 text-center text-sm text-white">
      <p className="mb-0 font-medium">{t('landing.footer.text')}</p>
    </footer>
  );
}
