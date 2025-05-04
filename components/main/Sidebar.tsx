import { Dialog, DialogBackdrop, DialogPanel, TransitionChild } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { useState, ReactNode, JSX } from 'react'

type NavigationItem = {
  name: string;
  href: string;
  icon: React.ElementType;
  current: boolean;
};

type TeamItem = {
  id: number;
  name: string;
  href: string;
  initial: string;
  current: boolean;
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function SidebarContent({
  children,
  navigation,
  teams,
  logoUrl
}: {
  children: ReactNode;
  navigation: NavigationItem[];
  teams: TeamItem[];
  logoUrl?: string;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div>
      {/* Mobile Sidebar */}
      <Dialog open={sidebarOpen} onClose={setSidebarOpen} className="relative z-50 lg:hidden">
        <DialogBackdrop className="fixed inset-0 bg-gray-900/80 transition-opacity" />
        <div className="fixed inset-0 flex">
          <DialogPanel className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out">
            <TransitionChild>
              <div className="absolute top-0 left-full flex w-16 justify-center pt-5">
                <button onClick={() => setSidebarOpen(false)} className="-m-2.5 p-2.5">
                  <span className="sr-only">Close sidebar</span>
                  <XMarkIcon className="size-6 text-white" />
                </button>
              </div>
            </TransitionChild>

            {/* Move logo inside gray background */}
            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-2 ring-1 ring-white/10">
              <div className="flex h-16 shrink-0 items-center">
                <img alt="Your Company" src={logoUrl} className="h-8 w-auto" />
              </div>
              <SidebarNav navigation={navigation} teams={teams} />
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* Static Sidebar Desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6">
          <div className="flex h-16 shrink-0 items-center">
            <img alt="Your Company" src={logoUrl} className="h-8 w-auto" />
          </div>
          <SidebarNav navigation={navigation} teams={teams} />
        </div>
      </div>

      {/* Top Bar Mobile */}
      <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-gray-900 px-4 py-4 shadow-xs sm:px-6 lg:hidden">
        <button onClick={() => setSidebarOpen(true)} className="-m-2.5 p-2.5 text-gray-400">
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon className="size-6" />
        </button>
        <div className="flex-1 text-sm font-semibold text-white">Dashboard</div>
        <a href="#">
          <img
            alt=""
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            className="size-8 rounded-full bg-gray-800"
          />
        </a>
      </div>

      {/* Main Content */}
      <main className="py-10 lg:pl-72 bg-white">
  <div className="px-2 sm:px-4 lg:px-6 xl:px-8 2xl:px-10 max-w-screen-2xl mx-auto w-full">
    {children}
  </div>
</main>
    </div>
  );
}

function SidebarNav({ navigation = [], teams = [] }: { navigation?: NavigationItem[]; teams?: TeamItem[] }) {
  return (
    <nav className="flex flex-1 flex-col">
      <ul role="list" className="flex flex-1 flex-col gap-y-7">
        <li>
          <ul role="list" className="-mx-2 space-y-1">
            {navigation.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  className={classNames(
                    item.current ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                    'group flex gap-x-3 rounded-md p-2 text-sm font-semibold'
                  )}
                >
                  <item.icon className="size-6 shrink-0" />
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </li>
        <li>
          <div className="text-xs font-semibold text-gray-400">Your teams</div>
          <ul role="list" className="-mx-2 mt-2 space-y-1">
            {teams.map((team) => (
              <li key={team.name}>
                <a
                  href={team.href}
                  className={classNames(
                    team.current ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                    'group flex gap-x-3 rounded-md p-2 text-sm font-semibold'
                  )}
                >
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-[0.625rem] font-medium text-gray-400 group-hover:text-white">
                    {team.initial}
                  </span>
                  <span className="truncate">{team.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </li>
      </ul>
    </nav>
  );
}

