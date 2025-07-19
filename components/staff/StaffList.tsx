import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid';
import { Person } from '@/components/data/StaffList';

type Props = {
  people: Person[];
  onAssignRole: (person: Person) => void;
  onRemove: (person: Person) => void;
};

export default function PersonList({ people, onAssignRole, onRemove }: Props) {
  return (
    <ul role="list" className="divide-y divide-gray-100">
      {people.map((person) => (
        <li key={person.email} className="flex justify-between gap-x-6 py-5">
          <div className="flex min-w-0 gap-x-4">
            {person.imageUrl ? (
              <img
                alt=""
                src={person.imageUrl}
                className="size-12 flex-none rounded-full bg-gray-50 object-cover"
              />
            ) : (
              <div className="size-12 flex-none rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                {person.name?.[0] ?? '?'}
              </div>
            )}
            <div className="min-w-0 flex-auto">
              <p className="text-sm font-semibold text-gray-900">
                {person.href ? (
                  <a href={person.href} className="hover:underline">
                    {person.name}
                  </a>
                ) : (
                  person.name
                )}
              </p>
              <p className="mt-1 text-xs text-gray-500 truncate">
                <a href={`mailto:${person.email}`} className="hover:underline">
                  {person.email}
                </a>
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-x-6">
            <div className="hidden sm:flex sm:flex-col sm:items-end">
              <p className="text-sm text-gray-900">{person.role}</p>
              {person.lastSeen ? (
                <p className="mt-1 text-xs text-gray-500">
                  Last seen{' '}
                  <time dateTime={person.lastSeenDateTime}>{person.lastSeen}</time>
                </p>
              ) : (
                <div className="mt-1 flex items-center gap-x-1.5">
                  <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                    <div className="size-1.5 rounded-full bg-emerald-500" />
                  </div>
                  <p className="text-xs text-gray-500">Online</p>
                </div>
              )}
            </div>

            <Menu as="div" className="relative flex-none">
              <MenuButton className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                <span className="sr-only">Open options</span>
                <EllipsisVerticalIcon aria-hidden="true" className="size-5" />
              </MenuButton>
              <MenuItems className="absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                <MenuItem>
                  {({ active }) => (
                    <button
                      type="button"
                      onClick={() => onAssignRole(person)}
                      className={`w-full text-left px-3 py-1 text-sm ${
                        active ? 'bg-gray-50 text-gray-900' : 'text-gray-700'
                      }`}
                    >
                      Assign Role
                    </button>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ active }) => (
                    <button
                      type="button"
                      onClick={() => onRemove(person)}
                      className={`w-full text-left px-3 py-1 text-sm ${
                        active ? 'bg-gray-50 text-gray-900' : 'text-red-600'
                      }`}
                    >
                      Remove
                    </button>
                  )}
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </li>
      ))}
    </ul>
  );
}
