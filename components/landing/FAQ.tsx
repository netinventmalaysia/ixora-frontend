import { useState, ReactNode } from 'react';
import { useTranslation } from '@/utils/i18n';

interface FaqGroup { id: string; heading: string; body: ReactNode; open?: boolean }

export function FAQ(){
  const { t } = useTranslation();
  // Build groups from translation keys 1..7
  const translated: FaqGroup[] = Array.from({ length: 7 }).map((_, idx) => {
    const id = (idx + 1).toString();
    const base = `landing.faq.groups.${id}`;
    const heading = t(`${base}.heading`);
    // Determine body content shape: questions (q1/a1 etc), list, or body string
    const q1 = t(`${base}.q1`);
    const a1 = t(`${base}.a1`);
    let body: ReactNode;
    const list = t(`${base}.list`);
    const bodyText = t(`${base}.body`);
    if (q1 !== `${base}.q1`) {
      // Has question/answer pattern
      const q2 = t(`${base}.q2`);
      const a2 = t(`${base}.a2`);
      const q3 = t(`${base}.q3`);
      const a3 = t(`${base}.a3`);
      body = (
        <div>
          {q1 !== `${base}.q1` && <p><strong>{q1}</strong> {a1}</p>}
          {q2 !== `${base}.q2` && <><br/><p><strong>{q2}</strong> {a2}</p></>}
          {q3 !== `${base}.q3` && <><br/><p><strong>{q3}</strong> {a3}</p></>}
        </div>
      );
    } else if (Array.isArray(list)) {
      body = (
        <ul className="list-disc pl-4 space-y-1">
          {list.map((li: string, i: number) => <li key={i}>{li}</li>)}
        </ul>
      );
    } else if (bodyText !== `${base}.body`) {
      body = <div>{bodyText}</div>;
    } else {
      body = null;
    }
    return { id: `faq${id}`, heading, body, open: idx === 0 };
  }).filter(g => g.heading && g.body);

  const [openItems, setOpen] = useState<string[]>(translated.filter(g=>g.open).map(g=>g.id));
  const toggle = (id: string) => setOpen(o => o.includes(id) ? o.filter(i=>i!==id) : [...o,id]);

  return (
    <section id="faq" className="py-20">
      <div className="mx-auto max-w-4xl px-4">
        <h2 className="mb-8 text-center text-3xl font-bold text-gray-900 dark:text-white">{t('landing.faq.title')}</h2>
        <div className="space-y-4">
          {translated.map(g => {
            const isOpen = openItems.includes(g.id);
            return (
              <div key={g.id} className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
                <button onClick={() => toggle(g.id)} className="flex w-full items-center justify-between bg-gray-50 px-4 py-3 text-left text-sm font-semibold text-gray-700 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800">
                  <span>{g.heading}</span>
                  <span className="ml-4 text-xs">{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen && (
                  <div className="bg-white px-4 py-4 text-sm leading-relaxed text-gray-700 dark:bg-gray-950 dark:text-gray-300">
                    {g.body}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
