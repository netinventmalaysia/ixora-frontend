
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { logoutUser } from 'todo/services/api';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
  const performLogout = async () => {
    try {
      await logoutUser(); // Call API first before clearing tokens
    } catch (error) {
      console.error('Logout failed:', error);
      // Optionally ignore the error if logout is not critical
    } finally {
      // Clear all storage AFTER attempting logout
      try {
        localStorage.clear();
      } catch {}
      try {
        sessionStorage.clear();
      } catch {}

      router.replace('/login');
    }
  };

  performLogout();
}, [router]);


  return null;
}
