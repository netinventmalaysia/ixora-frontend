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
