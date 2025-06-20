// components/ItemList.tsx

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid';

type Item = {
  id: number | string;
  name: string;
  href: string;
  status: string;
  createdBy: string;
  dueDate: string;
  dueDateTime: string;
};

type StatusMap = Record<string, string>;

type ActionItem = {
  label: string;
  onClick?: (item: Item) => void;
};

type ItemListProps = {
  items: Item[];
  statusClasses: StatusMap;
  actions?: ActionItem[];
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function ItemList({ items, statusClasses, actions = [] }: ItemListProps) {
  return (
    <ul role="list" className="divide-y divide-gray-100">
      {items.map((item) => (
        <li key={item.id} className="flex items-center justify-between gap-x-6 py-5">
          <div className="min-w-0">
            <div className="flex items-start gap-x-3">
              <p className="text-sm/6 font-semibold text-gray-900">{item.name}</p>
              <p
                className={classNames(
                  statusClasses[item.status],
                  'mt-0.5 rounded-md px-1.5 py-0.5 text-xs font-medium whitespace-nowrap ring-1 ring-inset',
                )}
              >
                {item.status}
              </p>
            </div>
            <div className="mt-1 flex items-center gap-x-2 text-xs/5 text-gray-500">
              <p className="whitespace-nowrap">
                Created: <time dateTime={item.dueDateTime}>{item.dueDate}</time>
              </p>
              <svg viewBox="0 0 2 2" className="size-0.5 fill-current">
                <circle r={1} cx={1} cy={1} />
              </svg>
              <p className="truncate"> By {item.createdBy}</p>
            </div>
          </div>
          <div className="flex flex-none items-center gap-x-4">
            <a
              href={item.href}
              className="hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:block"
            >
              View<span className="sr-only">, {item.name}</span>
            </a>
            {actions.length > 0 && (
              <Menu as="div" className="relative flex-none">
                <MenuButton className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                  <span className="sr-only">Open options</span>
                  <EllipsisVerticalIcon aria-hidden="true" className="size-5" />
                </MenuButton>
                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                >
                  {actions.map((action) => (
                    <MenuItem key={action.label}>
                      <button
                        type="button"
                        onClick={() => action.onClick?.(item)}
                        className="w-full text-left px-3 py-1 text-sm/6 text-gray-900 data-focus:bg-gray-50 data-focus:outline-hidden"
                      >
                        {action.label}
                        <span className="sr-only">, {item.name}</span>
                      </button>
                    </MenuItem>
                  ))}
                </MenuItems>
              </Menu>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
