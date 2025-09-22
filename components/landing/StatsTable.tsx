import { useTranslation } from '@/utils/i18n';

export function StatsTable(){
  const { t } = useTranslation();
  // raw data (numbers remain same across locales)
  const raw = [
    ['cash','2021','78,877'],['cashless','2021','65,840'],['cash','2022','96,882'],['cashless','2022','77,015'],['cash','2023','75,220'],['cashless','2023','76,179'],['cash','2024','46,287'],['cashless','2024','89,032'],['cash','2025','3,888'],['cashless','2025','68,200']
  ];
  return (
    <div className="overflow-hidden overflow-x-auto rounded-lg border border-gray-200 shadow-sm dark:border-gray-800">
      <table className="min-w-full divide-y divide-gray-200 text-sm dark:divide-gray-700">
        <thead className="bg-gray-900 text-white dark:bg-gray-800">
          <tr>
            <th className="px-4 py-2 font-semibold tracking-wide text-left">{t('landing.table.channel', 'Saluran')}</th>
            <th className="px-4 py-2 font-semibold tracking-wide text-left">{t('landing.table.year', 'Tahun')}</th>
            <th className="px-4 py-2 font-semibold tracking-wide text-left">{t('landing.table.totalBills', 'Jumlah Bil')}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900">
          {raw.map((r,i)=>(
            <tr key={i} className="even:bg-gray-50 dark:even:bg-gray-800/40">
              <td className="px-4 py-2 font-medium text-gray-700 dark:text-gray-200">{t(`landing.table.channelType.${r[0]}`, r[0])}</td>
              <td className="px-4 py-2 text-gray-600 dark:text-gray-300">{r[1]}</td>
              <td className="px-4 py-2 text-gray-600 dark:text-gray-300">{r[2]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
