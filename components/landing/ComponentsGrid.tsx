const items = [
  'Portal','Mobile App','AI Assistant','Workspace','Access','NotifyMe','Private Cloud','Analytics','Identity'
];

export function ComponentsGrid(){
  return (
    <section id="komponen" className="py-16">
      <div className="mx-auto max-w-6xl px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Komponen IXORA</h2>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {items.map(item => (
            <div key={item} className="rounded-lg border border-gray-200 bg-white p-6 text-sm font-medium shadow-sm dark:border-gray-800 dark:bg-gray-800">
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
