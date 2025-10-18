import { useEffect, useState } from 'react';
import { fetchMyBusinesses } from '@/services/api';
import ItemList from '../forms/ItemList';
import Heading from '../forms/Heading';
import LayoutWithoutSidebar from '@/components/main/LayoutWithoutSidebar';
import { statuses } from '@/components/data/ItemData';
import { RegistrationApplicationActions } from '@/components/config/ActionList';

export default function Application() {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  fetchMyBusinesses()
  .then((data) => setBusinesses(data))
    .catch((err) => {
      if (err.response?.status !== 401) {
        console.error('Error fetching businesses:', err);
      }
      
    })
    .finally(() => setLoading(false));
}, []);

  return (
    <LayoutWithoutSidebar shiftY="-translate-y-0">
      <Heading level={5} align="left" bold>
        Business Application
      </Heading>

      {loading ? (
        <p>Loading...</p>
      ) : businesses.length === 0 ? (
        <div className="mt-6 rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center">
          <h3 className="text-base font-semibold text-gray-900">No registrations yet</h3>
          <p className="mt-2 text-sm text-gray-600">
            You don&apos;t have any business registrations. Start by creating your first registration.
          </p>
          <div className="mt-4">
            <a
              href="/business/registration"
              className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              Go to Business Registration →
            </a>
          </div>
        </div>
      ) : (
        <ItemList
          items={businesses}
          statusClasses={statuses}
          actions={RegistrationApplicationActions}
          onItemUpdated={(updated) => {
            setBusinesses((prev: any[]) => prev.map((b) => (b.id === updated.id ? updated : b)));
          }}
        />
      )}
    </LayoutWithoutSidebar>
  );
}
