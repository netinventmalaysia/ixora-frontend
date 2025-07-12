import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { EllipsisHorizontalIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';

type StatusColorMap = Record<string, string>;

export type CardItem = {
  id: number;
  name: string;
  lastInvoice: {
    date: string;
    dateTime: string;
    amount: string;
    status: string;
  };
};

type CardAction = {
  label: string;
  onClick: (item: CardItem) => void;
};

type CardListProps = {
  items: CardItem[];
  statusColors: StatusColorMap;
  actions?: CardAction[];
  selectable?: boolean; // ✅ new
  selectedIds?: number[]; // ✅ new
  onSelect?: (id: number) => void; // ✅ new
};

export default function CardList({
  items,
  statusColors,
  actions,
  selectable = false,
  selectedIds = [],
  onSelect,
}: CardListProps) {
  return (
    <ul role="list" className="grid grid-cols-1 gap-y-6">
      {items.map((client) => {
        const isSelected = selectedIds.includes(client.id);

        return (
          <li
            key={client.id}
            className={clsx(
              'overflow-hidden rounded-xl border border-gray-200',
              isSelected && selectable && 'ring-2 ring-indigo-500'
            )}
          >
            <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">
              {selectable && (
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onSelect?.(client.id)}
                  className="size-4 accent-indigo-600"
                />
              )}

              <div className="text-sm font-bold text-gray-900">{client.name}</div>

              {actions && (
                <Menu as="div" className="relative ml-auto">
                  <MenuButton className="-m-2.5 block p-2.5 text-gray-400 hover:text-gray-500">
                    <span className="sr-only">Open options</span>
                    <EllipsisHorizontalIcon aria-hidden="true" className="size-5" />
                  </MenuButton>
                  <MenuItems className="absolute right-0 z-10 mt-0.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                    {actions.map((action) => (
                      <MenuItem key={action.label}>
                        <button
                          onClick={() => action.onClick(client)}
                          className="block w-full px-3 py-1 text-left text-sm text-gray-900 hover:bg-gray-50"
                        >
                          {action.label}
                        </button>
                      </MenuItem>
                    ))}
                  </MenuItems>
                </Menu>
              )}
            </div>

            <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm">
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500">Last invoice</dt>
                <dd className="text-gray-700">
                  <time dateTime={client.lastInvoice.dateTime}>{client.lastInvoice.date}</time>
                </dd>
              </div>
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500">Amount</dt>
                <dd className="flex items-start gap-x-2">
                  <div className="font-medium text-gray-900">{client.lastInvoice.amount}</div>
                  <div
                    className={clsx(
                      statusColors[client.lastInvoice.status],
                      'rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset'
                    )}
                  >
                    {client.lastInvoice.status}
                  </div>
                </dd>
              </div>
            </dl>
          </li>
        );
      })}
    </ul>
  );
}
