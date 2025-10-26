import { useState, useEffect, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import Heading from '../forms/Heading';
import Spacing from '../forms/Spacing';
import LayoutWithoutSidebar from '../main/LayoutWithoutSidebar';
import LineSeparator from '../forms/LineSeparator';
import CardList from '../forms/CardList';
import FilterTabs from '../forms/FilterTabs';
import Button from '../forms/Button';
import toast from 'react-hot-toast';
import { statusColors } from '../config/StatusColors';
import { BillingActions } from '../config/ActionList';

// 💡 Mock Data for Vendor Payment Status
const mockVendorPayments = [
  {
    id: 101,
    name: 'Supply of Smart Parking Sensors',
    vendor: 'UrbanFix Engineering',
    amount: 'RM 45,600.00',
    lastInvoice: { status: 'In Progress', amount: 'RM 45,600.00', dueDate: '2025-02-20' },
    department: 'ICT Department',
  },
  {
    id: 102,
    name: 'Road Maintenance Project – Zone A',
    vendor: 'MegaBuild Construction Sdn Bhd',
    amount: 'RM 82,000.00',
    lastInvoice: { status: 'Successful', amount: 'RM 82,000.00', dueDate: '2025-01-15' },
    department: 'Engineering Department',
  },
  {
    id: 103,
    name: 'Landscape & Cleaning Services (Q1)',
    vendor: 'GreenPro Facility Management',
    amount: 'RM 68,000.00',
    lastInvoice: { status: 'Pending Verification', amount: 'RM 68,000.00', dueDate: '2025-03-01' },
    department: 'Environment Department',
  },
  {
    id: 104,
    name: 'ICT Equipment Maintenance 2025',
    vendor: 'TechNova Systems',
    amount: 'RM 95,500.00',
    lastInvoice: { status: 'Paid', amount: 'RM 95,500.00', dueDate: '2024-12-30' },
    department: 'ICT Department',
  },
  {
    id: 105,
    name: 'Smart CCTV Installation (Phase 2)',
    vendor: 'SecureVision Solutions',
    amount: 'RM 74,800.00',
    lastInvoice: { status: 'Processing', amount: 'RM 74,800.00', dueDate: '2025-02-10' },
    department: 'Security & Enforcement',
  },
];

export default function VendorBilling() {
  const methods = useForm();
  const [currentTab, setCurrentTab] = useState<string>('All');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<any[]>([]);

  // Load mock data
  useEffect(() => {
    setTimeout(() => {
      setInvoices(mockVendorPayments);
      setLoading(false);
    }, 1000);
  }, []);

  // Helpers
  const normalizeStatus = (status: string) => status.toLowerCase();
  const isPaid = (inv: any) => /^(paid|successful)$/i.test(inv.lastInvoice.status);
  const isInProgress = (inv: any) => /^(processing|in progress)$/i.test(inv.lastInvoice.status);
  const isPending = (inv: any) => /^(pending|pending verification)$/i.test(inv.lastInvoice.status);

  const counts = useMemo(() => {
    const total = invoices.length;
    const paid = invoices.filter(isPaid).length;
    const inProgress = invoices.filter(isInProgress).length;
    const pending = invoices.filter(isPending).length;
    return { total, paid, inProgress, pending };
  }, [invoices]);

  const tabOptions: {
    name: string;
    href: string;
    badge: string;
    badgeColor?: 'blue' | 'yellow' | 'red' | 'green' | 'gray' | 'indigo' | 'purple' | 'pink';
  }[] = [
    { name: 'All', href: '#', badge: String(counts.total), badgeColor: 'blue' },
    { name: 'In Progress', href: '#', badge: String(counts.inProgress), badgeColor: 'yellow' },
    { name: 'Pending', href: '#', badge: String(counts.pending), badgeColor: 'red' },
    { name: 'Successful', href: '#', badge: String(counts.paid), badgeColor: 'green' },
  ];

  const filteredBilling = invoices.filter((invoice: any) => {
    if (currentTab === 'All') return true;
    if (currentTab === 'Successful') return isPaid(invoice);
    if (currentTab === 'Pending') return isPending(invoice);
    if (currentTab === 'In Progress') return isInProgress(invoice);
    return true;
  });

  const handleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const totalAmount = filteredBilling
    .filter((item) => selectedIds.includes(item.id))
    .reduce(
      (sum, item) =>
        sum + parseFloat(item.lastInvoice.amount.replace(/[^\d.-]/g, '')),
      0
    );

  const handleAcknowledgePayment = () => {
    toast.success(`Acknowledged payment for ${selectedIds.length} project(s).`);
    setSelectedIds([]);
  };

  return (
    <FormProvider {...methods}>
      <LayoutWithoutSidebar shiftY="-translate-y-0">
        <Heading level={5} align="left" bold>
          Payment Status
        </Heading>

        <FilterTabs
          tabs={tabOptions}
          currentTab={currentTab}
          onTabChange={(tab) => {
            setCurrentTab(tab.name);
            setSelectedIds([]);
          }}
        />

        {currentTab === 'In Progress' && (
          <div className="flex justify-between items-center mt-4 mb-2">
            <p className="text-sm font-semibold text-gray-700">
              Selected: RM {totalAmount.toFixed(2)}
            </p>
            <Button
              onClick={handleAcknowledgePayment}
              disabled={selectedIds.length === 0}
              className="px-4 py-2 text-sm"
            >
              Mark as Acknowledged
            </Button>
          </div>
        )}

        {loading ? (
          <p>Loading vendor payments...</p>
        ) : (
          <CardList
            items={filteredBilling.map((inv) => ({
              ...inv,
              description: `${inv.vendor} • ${inv.department} • ${inv.lastInvoice.amount} • Due ${inv.lastInvoice.dueDate}`,
              status: inv.lastInvoice.status,
            }))}
            statusColors={statusColors}
            actions={BillingActions}
            selectable={currentTab === 'In Progress'}
            selectedIds={selectedIds}
            onSelect={handleSelect}
          />
        )}
      </LayoutWithoutSidebar>
    </FormProvider>
  );
}