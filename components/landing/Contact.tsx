import Button from '@/components/forms/Button';
import Link from 'next/link';
import { useTranslation } from '@/utils/i18n';

export function Contact(){
  const { t } = useTranslation();
  return (
    <section id="hubungi" className="bg-gray-50 py-20 dark:bg-gray-900">
      <div className="mx-auto max-w-5xl px-4">
  <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-white">{t('landing.contact.title')}</h2>
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800">
            <h5 className="mb-3 flex items-center text-sm font-semibold"><span className="mr-2">📍</span>{t('landing.contact.addressLabel')}</h5>
            {(() => {
              const lines = t('landing.contact.addressLines') as any;
              const arr = Array.isArray(lines) ? lines : [];
              return (
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {arr.map((ln:string,i:number)=>(<span key={i}>{ln}{i < arr.length-1 && <br/>}</span>))}
                </p>
              );
            })()}
            <h5 className="mt-5 mb-2 flex items-center text-sm font-semibold"><span className="mr-2">☎️</span>{t('landing.contact.phoneLabel')}</h5>
            <p className="text-sm"><a href="tel:+606xxxxxxx" className="text-[#B01C2F] hover:underline">+60 6-XXXX XXXX</a></p>
            <h5 className="mt-5 mb-2 flex items-center text-sm font-semibold"><span className="mr-2">✉️</span>{t('landing.contact.emailLabel')}</h5>
            <p className="text-sm"><a href="mailto:ixora@mbmb.gov.my" className="text-[#B01C2F] hover:underline">ixora@mbmb.gov.my</a></p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700" target="_blank" rel="noopener noreferrer" href="https://wa.me/60123456789">WhatsApp</a>
              <a className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700" target="_blank" rel="noopener noreferrer" href="https://maps.google.com?q=MBMB Melaka">Google Maps</a>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-6 text-center dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{t('landing.contact.panelTitle')}</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{t('landing.contact.panelDesc')}</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/signup" className="inline-flex"><Button variant="primary">{t('landing.contact.ctaRegister')}</Button></Link>
              <Link href="/login" className="inline-flex"><Button variant="secondary">{t('landing.contact.ctaLogin')}</Button></Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
