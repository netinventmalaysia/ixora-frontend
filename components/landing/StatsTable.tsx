export function StatsTable(){
  const rows = [
    ['Cash','2021','78,877'],['Cashless','2021','65,840'],['Cash','2022','96,882'],['Cashless','2022','77,015'],['Cash','2023','75,220'],['Cashless','2023','76,179'],['Cash','2024','46,287'],['Cashless','2024','89,032'],['Cash','2025','3,888'],['Cashless','2025','68,200']
  ];
  return (
    <div className="overflow-hidden overflow-x-auto rounded-lg border border-gray-200 shadow-sm dark:border-gray-800">
      <table className="min-w-full divide-y divide-gray-200 text-sm dark:divide-gray-700">
        <thead className="bg-gray-900 text-white dark:bg-gray-800">
          <tr>
            <th className="px-4 py-2 font-semibold tracking-wide text-left">Saluran</th>
            <th className="px-4 py-2 font-semibold tracking-wide text-left">Tahun</th>
            <th className="px-4 py-2 font-semibold tracking-wide text-left">Jumlah Bil</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900">
          {rows.map((r,i)=>(
            <tr key={i} className="even:bg-gray-50 dark:even:bg-gray-800/40">
              <td className="px-4 py-2 font-medium text-gray-700 dark:text-gray-200">{r[0]}</td>
              <td className="px-4 py-2 text-gray-600 dark:text-gray-300">{r[1]}</td>
              <td className="px-4 py-2 text-gray-600 dark:text-gray-300">{r[2]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
