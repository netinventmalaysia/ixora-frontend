import { useEffect, useState } from 'react';
import SidebarLayout from '@/components/main/SidebarLayout';
import Heading from '@/components/forms/Heading';
import Spacing from '@/components/forms/Spacing';
import SelectField from '@/components/forms/SelectField';
import Button from '@/components/forms/Button';
import toast from 'react-hot-toast';
import { updateUser } from '@/services/api';
import getErrorMessage from '@/utils/getErrorMessage';

const LANG_OPTS = [
  { value: 'en', label: 'English' },
  { value: 'ms', label: 'Bahasa Malaysia' },
  { value: 'zh', label: 'Chinese' },
];

export default function SettingsPage() {
  const [lang, setLang] = useState<string>(() => typeof window !== 'undefined' ? localStorage.getItem('ixora:lang') || 'en' : 'en');
  const [locationPermission, setLocationPermission] = useState<string>('prompt');
  const [notificationPermission, setNotificationPermission] = useState<string>(typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // query Permissions API when available
    if (typeof navigator !== 'undefined' && (navigator as any).permissions) {
      try {
        (navigator as any).permissions.query({ name: 'geolocation' }).then((p: any) => setLocationPermission(p.state));
      } catch (e) {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    // keep permission state updated when page is open
    const interval = setInterval(() => {
      if (typeof navigator !== 'undefined' && 'permissions' in navigator) {
        try {
          (navigator as any).permissions.query({ name: 'geolocation' }).then((p: any) => setLocationPermission(p.state));
        } catch (e) {}
      }
      if (typeof window !== 'undefined' && 'Notification' in window) {
        setNotificationPermission(Notification.permission);
      }
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const handleLangChange = async (e: any) => {
    const v = String(e.target.value);
    setLang(v);
    localStorage.setItem('ixora:lang', v);
    toast.success('Language saved locally');

    // best-effort: update backend profile if available and user appears authenticated
    try {
      const storedId = localStorage.getItem('userId');
      if (!storedId) return;
      setSaving(true);
      try {
        await updateUser({ id: Number(storedId), preferredLanguage: v });
        toast.success('Language synced to your account');
      } catch (err: any) {
        const msg = getErrorMessage(err);
        // If backend forbids the request (403) it's probably because the user is not authenticated.
        if (err?.response?.status === 403) {
          toast('Saved locally. Please sign in to sync to your account.');
          console.warn('Language sync rejected (403):', msg);
        } else {
          toast.error(msg || 'Failed to sync language to account');
        }
      } finally {
        setSaving(false);
      }
    } catch (outer) {
      // nothing else to do
    }
  };

  const requestLocation = () => {
    if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
      toast.error('Geolocation is not available in this browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocationPermission('granted');
        toast.success('Location access granted');
        // optionally save coordinates locally
        try { localStorage.setItem('ixora:location', JSON.stringify({ lat: pos.coords.latitude, lng: pos.coords.longitude })); } catch (e) {}
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) setLocationPermission('denied');
        toast.error('Location permission denied or unavailable');
      }
    );
  };

  const requestNotifications = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      toast.error('Notifications are not supported in this browser');
      return;
    }

    try {
      const res = await Notification.requestPermission();
      setNotificationPermission(res);
      if (res === 'granted') toast.success('Notifications allowed');
      else if (res === 'denied') toast.error('Notifications denied');
      else toast('Notification permission dismissed');
    } catch (e) {
      toast.error('Unable to request notification permission');
    }
  };

  return (
  <SidebarLayout>
      <Heading level={4} align="left" bold>Settings</Heading>

      <Spacing size="lg" />

      <div className="max-w-xl">
        <div className="bg-white shadow sm:rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-900">Language</h3>
          <p className="mt-1 text-xs text-gray-500">Choose your preferred language for the UI.</p>
          <div className="mt-3">
            <SelectField id="language" name="language" label="Language" options={LANG_OPTS.map(o => ({ value: o.value, label: o.label }))} onChange={handleLangChange} />
          </div>
        </div>

        <Spacing size="lg" />

        <div className="bg-white shadow sm:rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-900">Location</h3>
          <p className="mt-1 text-xs text-gray-500">Allow access to your location for features that require it.</p>
          <div className="mt-3 flex items-center gap-x-4">
            <div className="text-sm text-gray-700">Status: <strong className="ml-1">{locationPermission}</strong></div>
            <Button type="button" onClick={requestLocation} variant="primary" size="sm">Request Location</Button>
          </div>
        </div>

        <Spacing size="lg" />

        <div className="bg-white shadow sm:rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-900">Push Notifications</h3>
          <p className="mt-1 text-xs text-gray-500">Allow push notifications from this application.</p>
          <div className="mt-3 flex items-center gap-x-4">
            <div className="text-sm text-gray-700">Status: <strong className="ml-1">{notificationPermission}</strong></div>
            <Button type="button" onClick={requestNotifications} variant="primary" size="sm">Request Permission</Button>
          </div>
        </div>
      </div>
  </SidebarLayout>
  );
}
