import { ReactNode, useEffect, useState } from 'react';
import SidebarContent from '@/components/main/Sidebar';
import { logoUrl } from '@/components/main/SidebarConfig';

export default function SidebarLayout({ children }: { children: ReactNode }) {
  const [userRole, setUserRole] = useState<string>('guest');
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role || 'guest');
    setUsername(localStorage.getItem('username') || 'Guest');
    setEmail(localStorage.getItem('email') || '');
  }, []);

  return (
    <SidebarContent teams={[]} logoUrl={logoUrl} userRole={userRole} username={username} email={email}>
      {children}
    </SidebarContent>
  );
}