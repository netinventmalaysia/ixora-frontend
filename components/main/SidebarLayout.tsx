import { ReactNode, useEffect, useState, useCallback } from 'react';
import SidebarContent from '@/components/main/Sidebar';
import CheckoutTray from '@/components/billing/CheckoutTray';
import { logoUrl } from '@/components/main/SidebarConfig';
import { useRouter } from 'next/router';

export default function SidebarLayout({ children }: { children: ReactNode }) {
  // start with server-safe defaults and populate from localStorage on mount
  const [userRole, setUserRole] = useState<string>('guest');
  const [fullName, setFullName] = useState<string>('Guest');
  const [email, setEmail] = useState<string>('');
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const refreshUser = useCallback(() => {
    try {
      const role = localStorage.getItem('userRole') || 'guest';
      // Prefer payerName (set by checkout/profile); fallback to cached profile full name then legacy 'username' then 'Guest'
      let name = 'Guest';
      try {
        name = localStorage.getItem('payerName') || '';
        if (!name) {
          const profRaw = localStorage.getItem('userProfile');
          if (profRaw) {
            const prof = JSON.parse(profRaw);
            const first = prof?.firstName || prof?.first_name || '';
            const last = prof?.lastName || prof?.last_name || '';
            name = `${first} ${last}`.trim() || prof?.fullName || prof?.full_name || prof?.name || '';
          }
        }
        if (!name) name = localStorage.getItem('username') || 'Guest';
      } catch {
        name = localStorage.getItem('username') || 'Guest';
      }
      const mail = localStorage.getItem('email') || '';
      setUserRole(role);
      setFullName(name);
      setEmail(mail);
    } catch (e) {
      // ignore (e.g., SSR or storage not available)
    }
  }, []);

  useEffect(() => {
    // populate from storage only after mount (client-side)
    refreshUser();
    setMounted(true);

    const handleStorageChange = () => {
      refreshUser();
    };
    window.addEventListener('storage', handleStorageChange);
    const langHandler = () => setMounted((m) => !m); // toggle to force re-render
    window.addEventListener('ixora:languagechange', langHandler as EventListener);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('ixora:languagechange', langHandler as EventListener);
    };
  }, [refreshUser]);

  if (!mounted) return null;

  // Show checkout only on specific pages
  const showCheckout = (() => {
    const allowedPaths = new Set([
      '/assessment-tax',
      '/misc-bills',
      '/compound',
      '/booth-rental',
      '/dashboard',
    ]);
    return allowedPaths.has(router.pathname);
  })();

  return (
    <SidebarContent teams={[]} logoUrl={logoUrl} userRole={userRole} fullName={fullName} email={email}>
      {children}
      {showCheckout && <CheckoutTray />}
    </SidebarContent>
  );
}