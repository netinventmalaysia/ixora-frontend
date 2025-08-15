import { useState, useEffect } from 'react';
import { getUserProfile, updateUser } from '@/services/api';
import toast from 'react-hot-toast';

export default function ProfileTestPage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem('userId');
    console.log('Loaded userId:', id);
    setUserId(id);
  }, []);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        if (!userId) return;
        const res = await getUserProfile(Number(userId));
        setProfile(res.data);
      } catch (err) {
        toast.error('Failed to load profile');
      }
    };
    if (userId) loadProfile();
  }, [userId]);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      //await fetchCsrfToken();
      await updateUser({ ...profile, firstName: 'Updated Name' });
      toast.success('Profile updated!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update');
    } finally {
      setLoading(false);
    }
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Profile Test Paging</h1>
      <pre className="bg-gray-100 p-2 my-2">{JSON.stringify(profile, null, 2)}</pre>
      <button
        onClick={handleUpdate}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        {loading ? 'Updating...' : 'Update First Name'}
      </button>
    </div>
  );
}
