import { ReactNode, useEffect, useState, useCallback } from 'react';
import SidebarContent from '@/components/main/Sidebar';
import { logoUrl } from '@/components/main/SidebarConfig';

export default function SidebarLayout({ children }: { children: ReactNode }) {
  const [userRole, setUserRole] = useState<string>('guest');
  const [username, setUsername] = useState<string>('Guest');
  const [email, setEmail] = useState<string>('');
  const [mounted, setMounted] = useState(false);

  const refreshUser = useCallback(() => {
    const role = localStorage.getItem('userRole') || 'guest';
    const name = localStorage.getItem('username') || 'Guest';
    const mail = localStorage.getItem('email') || '';
    setUserRole(role);
    setUsername(name);
    setEmail(mail);
  }, []);

  useEffect(() => {
    refreshUser();
    setMounted(true);

    const handleStorageChange = () => {
      refreshUser();
    };
  window.addEventListener('storage', handleStorageChange);
  const langHandler = () => setMounted((m) => !m); // toggle to force re-render
  window.addEventListener('ixora:languagechange', langHandler as EventListener);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [refreshUser]);

  if (!mounted) return null;

  return (
    <SidebarContent teams={[]} logoUrl={logoUrl} userRole={userRole} username={username} email={email}>
      {children}
    </SidebarContent>
  );
}