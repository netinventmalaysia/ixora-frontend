import { useEffect, useState } from 'react';
import ItemList from '../forms/ItemList';
import Heading from '../forms/Heading';
import LayoutWithoutSidebar from '@/components/main/LayoutWithoutSidebar';
import { statuses } from '@/components/data/ItemData';
import { RegistrationApplicationActions } from '@/components/config/ActionList';

export default function VendorProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock vendor project data — related to procurement workflow
  const mockProjects = [
    {
      id: 101,
      name: 'Maintenance of Street Lighting Zone A',
      vendorName: 'EcoSmart Services Enterprise',
      department: 'Engineering Department',
      status: 'In Progress',
      contractValue: 85000,
      startDate: '2025-01-10',
      endDate: '2025-03-25',
    },
    {
      id: 102,
      name: 'Supply and Installation of Smart Parking Sensors',
      vendorName: 'UrbanFix Engineering',
      department: 'ICT Department',
      status: 'Pending Approval',
      contractValue: 120000,
      startDate: '2025-02-01',
      endDate: '2025-06-15',
    },
    {
      id: 103,
      name: 'Cleaning and Landscaping Services at MBMB HQ',
      vendorName: 'GreenPro Facility Management',
      department: 'Environment & Landscape Department',
      status: 'Completed',
      contractValue: 68000,
      startDate: '2024-11-15',
      endDate: '2025-01-20',
    },
    {
      id: 104,
      name: 'ICT Equipment Supply & Maintenance (FY2025)',
      vendorName: 'MegaBuild Construction Sdn Bhd',
      department: 'ICT Department',
      status: 'Pending Payment',
      contractValue: 95000,
      startDate: '2025-03-01',
      endDate: '2025-05-30',
    },
  ];

  useEffect(() => {
    // Simulate backend load
    setTimeout(() => {
      setProjects(mockProjects);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <LayoutWithoutSidebar shiftY="-translate-y-0">
      <Heading level={5} align="left" bold>
        Procurement Projects
      </Heading>

      {loading ? (
        <p>Loading procurement projects...</p>
      ) : projects.length === 0 ? (
        <div className="mt-6 rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center">
          <h3 className="text-base font-semibold text-gray-900">No projects found</h3>
          <p className="mt-2 text-sm text-gray-600">
            There are currently no procurement projects linked to your vendor account.
          </p>
        </div>
      ) : (
        <ItemList
          items={projects.map((p) => ({
            ...p,
            name: p.name,
            status: p.status,
            description: `${p.department} • RM${p.contractValue.toLocaleString()} • ${p.startDate} → ${p.endDate}`,
          }))}
          statusClasses={statuses}
          actions={RegistrationApplicationActions}
          onItemUpdated={(updated) => {
            setProjects((prev: any[]) =>
              prev.map((proj) => (proj.id === updated.id ? updated : proj))
            );
          }}
        />
      )}
    </LayoutWithoutSidebar>
  );
}