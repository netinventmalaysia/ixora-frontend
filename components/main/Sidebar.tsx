import { useState, useEffect, ReactNode } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, TransitionChild } from '@headlessui/react';
import { ArrowRightCircleIcon, Bars3Icon, BriefcaseIcon, UserIcon, XMarkIcon } from '@heroicons/react/24/outline';
import {
  superAdminNavigation,
  accountNavigation,
  adminNavigation,
  userNavigation,
  developerNavigation,
  generalAppNavigation,
  businessEnrollmentNavigation,
  businessAppNavigation
} from '@/components/main/SidebarConfig';
import LineSeparator from '../forms/LineSeparator';
import SidebarNav from '@/components/main/SidebarNav';



export type NavigationItem = {
  name: string;
  href: string;
  icon: React.ElementType;
  current: boolean;
};

export type TeamItem = {
  id: number;
  name: string;
  href: string;
  initial: string;
  current: boolean;
};

export default function SidebarContent({
  children,
  teams,
  logoUrl,
  userRole,
  email,
  username,
}: {
  children: ReactNode;
  teams: TeamItem[];
  logoUrl?: string;
  userRole: string;
  email?: string;
  username?: string;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mode, setMode] = useState<'Personal' | 'Business'>(() => 'Personal');
  const [generalNav, setGeneralNav] = useState<NavigationItem[]>([]);
  const [personalNav, setPersonalNav] = useState<NavigationItem[]>([]);
  const [bottomNav, setBottomNav] = useState<NavigationItem[]>([]);

  useEffect(() => {
    const withCurrent = (items: NavigationItem[]) =>
      items.map((item) => ({
        ...item,
        current: false,
      }));

    if (mode === 'Personal') {
      switch (userRole) {
        case 'guest':
          setGeneralNav([]);
          setPersonalNav([]);
          setBottomNav([]);
          break;
        default:
          setGeneralNav(withCurrent([...generalAppNavigation]));
          setPersonalNav(withCurrent([...businessEnrollmentNavigation]));
          setBottomNav(withCurrent([...userNavigation]));
      }
    } else {
      switch (userRole) {
        case 'superadmin':
          setGeneralNav([]);
          setPersonalNav(withCurrent([...businessAppNavigation, ...superAdminNavigation]));
          setBottomNav(withCurrent([...userNavigation]));
          break;
        case 'admin':
          setGeneralNav([]);
          setPersonalNav(withCurrent([...businessAppNavigation, ...adminNavigation]));
          setBottomNav(withCurrent([...userNavigation]));
          break;
        case 'account':
          setGeneralNav([]);
          setPersonalNav(withCurrent([...accountNavigation]));
          setBottomNav(withCurrent([...userNavigation]));
          break;
        case 'developer':
          setGeneralNav([]);
          setPersonalNav(withCurrent([...developerNavigation]));
          setBottomNav(withCurrent([...userNavigation]));
          break;
        default:
          setGeneralNav([]);
          setPersonalNav([]);
          setBottomNav([]);
      }
    }
  }, [mode, userRole]);

  const toggleMode = () => {
    setMode((prev) => (prev === 'Personal' ? 'Business' : 'Personal'));
  };

  useEffect(() => {
    const saved = localStorage.getItem('user-mode');
    if (saved === 'Business' || saved === 'Personal') {
      setMode(saved);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('user-mode', mode);
  }, [mode]);

  const showModeToggle = userRole !== 'guest';
console.log('SidebarContent rendered with mode:', mode, 'and userRole:', userRole, 'username:', username, 'email:', email);
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
            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-2 ring-1 ring-white/10">
              <div className="flex h-16 shrink-0 items-center">
                <img alt="Your Company" src={logoUrl} className="h-8 w-auto" />
              </div>
              <SidebarNav general={generalNav} personal={personalNav} bottom={bottomNav}   teams={mode === 'Business' ? teams : []} />
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
          {showModeToggle && (
            <div className="flex flex-col text-white">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">Dashboard ({mode})</div>
                <button
                  onClick={toggleMode}
                  className="rounded bg-white/10 p-1 hover:bg-white/20"
                  title={mode === 'Personal' ? 'Switch to Business Mode' : 'Switch to Personal Mode'}
                >
                  {mode === 'Personal' ? (
                    <BriefcaseIcon className="h-6 w-6 text-white" />
                  ) : (
                    <UserIcon className="h-6 w-6 text-white" />
                  )}
                </button>
              </div>
                
              {mode === 'Personal' && (
                <div className="mt-1 text-xs text-gray-400">
                  <div>{username}</div>
                  <div>{email}</div>
                </div>
              )}
            </div>
          )}

          <SidebarNav general={generalNav} personal={personalNav} bottom={bottomNav}   teams={mode === 'Business' ? teams : []} />

        </div>
      </div>

      {/* Top Bar Mobile */}
      <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-gray-900 px-4 py-4 shadow-xs sm:px-6 lg:hidden">
        <button onClick={() => setSidebarOpen(true)} className="-m-2.5 p-2.5 text-gray-400">
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon className="size-6" />
        </button>
        <div className="flex-1 text-sm font-semibold text-white">Dashboard ({mode})</div>
        {showModeToggle && (
          <button
            onClick={toggleMode}
            className="rounded bg-white/10 p-1 hover:bg-white/20"
            title={mode === 'Personal' ? 'Switch to Business Mode' : 'Switch to Personal Mode'}
          >
            {mode === 'Personal' ? (
              <BriefcaseIcon className="h-6 w-6 text-white" />
            ) : (
              <UserIcon className="h-6 w-6 text-white" />
            )}
          </button>
        )}
           {mode === 'Personal' && (
                <div className="mt-1 text-xs text-gray-400">
                  <div>{username}</div>
                  <div>{email}</div>
                </div>
              )}
      </div>

      <main className="py-10 lg:pl-72 bg-white">
        <div className="px-2 sm:px-4 lg:px-6 xl:px-8 2xl:px-10 max-w-screen-2xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
