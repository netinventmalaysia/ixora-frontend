
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
      // Clear tokens AFTER attempting logout
      localStorage.removeItem('user-role');
      localStorage.removeItem('userRole');
      localStorage.removeItem('user-mode');
      localStorage.removeItem('access_token');
      localStorage.removeItem('csrfToken');
      localStorage.removeItem('userId');
  localStorage.removeItem('username'); // legacy - safe to remove in future
  localStorage.removeItem('userProfile');
      localStorage.removeItem('email');
      localStorage.removeItem('userProfile');
      localStorage.removeItem('userOrganisation');
      localStorage.removeItem('userCompanyName');
      localStorage.removeItem('userRegistrationNumber');
      localStorage.removeItem('csrfToken');
      localStorage.removeItem('auth_token');

      router.replace('/');
    }
  };

  performLogout();
}, [router]);


  return null;
}
