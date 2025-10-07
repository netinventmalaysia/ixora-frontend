import { useState, useEffect, ReactNode } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, TransitionChild } from '@headlessui/react';
import { Bars3Icon, BriefcaseIcon, UserIcon, XMarkIcon } from '@heroicons/react/24/outline';
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
import { useTranslation } from '@/utils/i18n';
import SidebarNav from '@/components/main/SidebarNav';
import { useRouter } from 'next/router';
// (fixed) remove duplicate import
// Global pull-to-refresh is now applied in _app; no local wrapper here

export type NavigationItem = {
  name?: string;
  nameKey?: string;
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
  // Initialize deterministically to avoid SSR/CSR mismatch. Read localStorage after mount.
  const [mode, setMode] = useState<'Personal' | 'Business'>('Personal');

  const [generalNav, setGeneralNav] = useState<NavigationItem[]>([]);
  const [personalNav, setPersonalNav] = useState<NavigationItem[]>([]);
  const [bottomNav, setBottomNav] = useState<NavigationItem[]>([]);
  const { t } = useTranslation();
  const router = useRouter();

  // keep a local copy of userRole so the sidebar can update immediately when
  // storage or a custom event changes the value (same-window storage writes
  // don't fire the storage event). Initialize from prop or localStorage.
  // Keep SSR-safe initial role; hydrate from localStorage after mount.
  const [localUserRole, setLocalUserRole] = useState<string>(userRole || 'guest');

  // Client-only hydration of mode and role from localStorage
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('user-mode');
        if (saved === 'Business' || saved === 'Personal') setMode(saved);
        const storedRole = localStorage.getItem('userRole');
        if (storedRole) setLocalUserRole(storedRole);
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // sync when parent prop changes
  useEffect(() => {
    if (userRole && userRole !== localUserRole) setLocalUserRole(userRole);
  }, [userRole]);

  // listen for storage events (other tabs) and a custom event for same-window updates
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'userRole') setLocalUserRole(e.newValue || 'guest');
      if (e.key === 'user-mode') {
        const next = e.newValue === 'Business' ? 'Business' : 'Personal';
        setMode(next);
      }
    };
    const onUserChange = () => {
      try {
        const v = localStorage.getItem('userRole') || 'guest';
        setLocalUserRole(v);
      } catch {}
    };
    window.addEventListener('storage', onStorage);
    window.addEventListener('ixora:userchange', onUserChange as EventListener);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('ixora:userchange', onUserChange as EventListener);
    };
  }, []);

  useEffect(() => {
    const withCurrent = (items: NavigationItem[]) => items.map(item => ({ ...item, current: false }));
  // If guest, always show only the general application navigation
  if (localUserRole === 'guest') {
  // translate names for general nav
  setGeneralNav(withCurrent(generalAppNavigation.map(i => ({ ...i, name: (i as any).nameKey ? t((i as any).nameKey) : (i as any).name }))));
      setPersonalNav([]);
      // show Settings and Sign out for guests: match by href instead of translated name
      const guestBottom = withCurrent(
        userNavigation.filter((i) => ['/account/settings', '/logout'].includes(i.href)).map(i => ({ ...i, name: (i as any).nameKey ? t((i as any).nameKey) : (i as any).name })) as NavigationItem[]
      );
      setBottomNav(guestBottom);
      return;
    }

    if (mode === 'Personal') {
      switch (localUserRole) {
        default:
          setGeneralNav(withCurrent(generalAppNavigation.map(i => ({ ...i, name: (i as any).nameKey ? t((i as any).nameKey) : (i as any).name }))));
          setPersonalNav(withCurrent(businessEnrollmentNavigation.map(i => ({ ...i, name: (i as any).nameKey ? t((i as any).nameKey) : (i as any).name }))));
          setBottomNav(withCurrent(userNavigation.map(i => ({ ...i, name: (i as any).nameKey ? t((i as any).nameKey) : (i as any).name }))));
      }
    } else {
      switch (localUserRole) {
        case 'superadmin':
          setGeneralNav([]);
          setPersonalNav(withCurrent([...businessAppNavigation, ...superAdminNavigation].map(i => ({ ...i, name: (i as any).nameKey ? t((i as any).nameKey) : (i as any).name }))));
          setBottomNav(withCurrent(userNavigation.map(i => ({ ...i, name: (i as any).nameKey ? t((i as any).nameKey) : (i as any).name }))));
          break;
        case 'admin':
          setGeneralNav([]);
          // Admin should not see My SKB; show only admin navigation
          setPersonalNav(withCurrent(adminNavigation.map(i => ({ ...i, name: (i as any).nameKey ? t((i as any).nameKey) : (i as any).name }))));
          setBottomNav(withCurrent(userNavigation.map(i => ({ ...i, name: (i as any).nameKey ? t((i as any).nameKey) : (i as any).name }))));
          break;
        case 'account':
          setGeneralNav([]);
          setPersonalNav(withCurrent(accountNavigation.map(i => ({ ...i, name: (i as any).nameKey ? t((i as any).nameKey) : (i as any).name }))));
          setBottomNav(withCurrent(userNavigation.map(i => ({ ...i, name: (i as any).nameKey ? t((i as any).nameKey) : (i as any).name }))));
          break;
        case 'developer':
          setGeneralNav([]);
          setPersonalNav(withCurrent(developerNavigation.map(i => ({ ...i, name: (i as any).nameKey ? t((i as any).nameKey) : (i as any).name }))));
          setBottomNav(withCurrent(userNavigation.map(i => ({ ...i, name: (i as any).nameKey ? t((i as any).nameKey) : (i as any).name }))));
          break;
        case 'business':
          setGeneralNav(withCurrent(generalAppNavigation.map(i => ({ ...i, name: (i as any).nameKey ? t((i as any).nameKey) : (i as any).name }))));
          setPersonalNav(withCurrent(businessAppNavigation.map(i => ({ ...i, name: (i as any).nameKey ? t((i as any).nameKey) : (i as any).name }))));
          break;
        default:
          setGeneralNav([]);
          setPersonalNav([]);
          setBottomNav([]);
      }
    }
  }, [mode, localUserRole]);

  const toggleMode = () => {
    const newMode = mode === 'Personal' ? 'Business' : 'Personal';
    console.log('Toggling mode to', newMode);
  try { if (typeof window !== 'undefined') localStorage.setItem('user-mode', newMode); } catch {}
    setMode(newMode);
    router.push('/dashboard');
  };

  useEffect(() => {
    try { if (typeof window !== 'undefined') localStorage.setItem('user-mode', mode); } catch {}
  }, [mode]);

  const showModeToggle = userRole !== 'guest';
  // Unified sidebar background color (custom blue) regardless of mode per new branding
  const sidebarBg = 'bg-[#B01C2F]';
  const displayMode = localUserRole === 'admin' && mode === 'Business' ? 'Admin' : mode;
  const personalLabel = localUserRole === 'admin' ? 'Admin' : 'Business';

  return (
    <div>
      {/* Mobile Sidebar */}
  <Dialog open={sidebarOpen} onClose={setSidebarOpen} className="relative z-50 lg:hidden">
        <DialogBackdrop className="fixed inset-0 bg-black/80 transition-opacity" />
        <div className="fixed inset-0 flex">
          <DialogPanel className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out">
            <TransitionChild>
              <div className="absolute top-0 left-full flex w-16 justify-center pt-5">
                <button onClick={() => setSidebarOpen(false)} className="-m-2.5 p-2.5">
                  <XMarkIcon className="size-6 text-white" />
                </button>
              </div>
            </TransitionChild>
            <div className={`flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-2 ring-1 ring-white/10 ${sidebarBg} text-white`}> 
              <div className="flex h-16 shrink-0 items-center">
                <img alt="Your Company" src={logoUrl} className="h-8 w-auto" />
              </div>
              <SidebarNav general={generalNav} personal={personalNav} bottom={bottomNav} teams={mode === 'Business' ? teams : []} personalLabel={personalLabel} />
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* Static Sidebar Desktop */}
      <div className={`hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col ${sidebarBg} text-white`}>
        <div className="flex grow flex-col gap-y-5 overflow-y-auto px-6">
          <div className="flex h-16 shrink-0 items-center">
            <img alt="Your Company" src={logoUrl} className="h-8 w-auto" />
          </div>
          {showModeToggle && (
            <div className="flex flex-col text-white">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">Dashboard ({displayMode})</div>
                {
                  // don't render toggle button at all for 'personal' or 'guest' roles
                  (userRole !== 'personal' && userRole !== 'guest') ? (
                    <button onClick={toggleMode} className="rounded bg-white/10 p-1 hover:bg-white/20">
                      {mode === 'Personal' ? <BriefcaseIcon className="h-6 w-6 text-white" /> : <UserIcon className="h-6 w-6 text-white" />}
                    </button>
                  ) : null
                }
              </div>
              {mode === 'Personal' && (
                <div className="mt-1 text-xs text-gray-300">
                  <div>{username}</div>
                  <div>{email}</div>
                </div>
              )}
            </div>
          )}
          <SidebarNav general={generalNav} personal={personalNav} bottom={bottomNav} teams={mode === 'Business' ? teams : []} personalLabel={personalLabel} />
        </div>
      </div>

      {/* Top Bar Mobile */}
  <div className={`sticky top-0 z-40 mb-3 flex items-center gap-x-6 px-4 py-3 shadow-xs sm:px-6 lg:hidden ${sidebarBg} text-white`}>
        <button onClick={() => setSidebarOpen(true)} className="-m-2.5 p-2.5 text-gray-400">
          <Bars3Icon className="size-6" />
        </button>
        <div className="flex-1 text-sm font-semibold text-white">Dashboard ({displayMode})</div>
        {showModeToggle && (userRole !== 'personal' && userRole !== 'guest') && (
          <button onClick={toggleMode} className="rounded bg-white/10 p-1 hover:bg-white/20">
            {mode === 'Personal' ? <BriefcaseIcon className="h-6 w-6 text-white" /> : <UserIcon className="h-6 w-6 text-white" />}
          </button>
        )}
        {mode === 'Personal' && (
          <div className="mt-1 text-xs text-gray-300">
            <div>{username}</div>
            <div>{email}</div>
          </div>
        )}
      </div>

  {/* Mobile spacing is lean; desktop spacing handled below */}

  <main className="pt-12 sm:pt-12 lg:pt-24 pb-10 lg:pl-72 bg-white">
          <div className="px-10 sm:px-4 lg:px-6 xl:px-8 2xl:px-10 max-w-screen-2xl mx-auto w-full">
            {children}
          </div>
      </main>
    </div>
  );
}
