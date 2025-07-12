import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid';
import { Profile } from '@/components/types/Profile';

type Action = {
  label: string;
  onClick: (profile: Profile) => void;
  danger?: boolean;
};

type Props = {
  profile: Profile;
  actions: Action[];
};

export default function ProfileActionMenu({ profile, actions }: Props) {
  return (
    <Menu as="div" className="relative flex-none">
      <MenuButton className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
        <span className="sr-only">Open options</span>
        <EllipsisVerticalIcon aria-hidden="true" className="size-5" />
      </MenuButton>
      <MenuItems className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
        {actions.map((action, idx) => (
          <MenuItem key={idx}>
            {({ active }) => (
              <button
                onClick={() => action.onClick(profile)}
                className={`w-full text-left px-3 py-1 text-sm ${
                  action.danger
                    ? 'text-red-600'
                    : active
                    ? 'bg-gray-50 text-gray-900'
                    : 'text-gray-700'
                }`}
              >
                {action.label}
              </button>
            )}
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  );
}