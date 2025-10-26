import { useEffect, useState } from 'react';
import PersonList from '@/components/staff/StaffList';
import { Person } from '@/components/data/StaffList';
import { FormProvider, useForm } from 'react-hook-form';
import Heading from '../forms/Heading';
import Spacing from '../forms/Spacing';
import LayoutWithoutSidebar from '../main/LayoutWithoutSidebar';
import SelectField from '../forms/SelectField';
import InputText from '../forms/InputText';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import LineSeparator from '../forms/LineSeparator';
import Button from '../forms/Button';
import toast from 'react-hot-toast';
import ConfirmSelectDialog from '../forms/ConfirmSelectDialog';

// ---- MOCK DATA ----
const mockVendors = [
  { id: 201, name: 'MegaBuild Construction Sdn Bhd' },
  { id: 202, name: 'EcoSmart Services Enterprise' },
  { id: 203, name: 'UrbanFix Engineering' },
];

// If Person type requires { id: number|string; email: string; role: string; imageUrl?: string }
const mockTeamByVendor: Record<number, Person[]> = {
  201: [
    {
        id: 1, email: 'ops@megabuild.com', role: 'admin', imageUrl: '',
        name: '',
        href: ''
    },
    {
        id: 2, email: 'finance@megabuild.com', role: 'account', imageUrl: '',
        name: '',
        href: ''
    },
    {
        id: 3, email: 'site@megabuild.com', role: 'staff', imageUrl: '',
        name: '',
        href: ''
    },
  ],
  202: [
    {
        id: 4, email: 'nadia@ecosmart.my', role: 'admin', imageUrl: '',
        name: '',
        href: ''
    },
    {
        id: 5, email: 'claims@ecosmart.my', role: 'approver', imageUrl: '',
        name: '',
        href: ''
    },
  ],
  203: [
    {
        id: 6, email: 'daniel@urbanfix.com', role: 'admin', imageUrl: '',
        name: '',
        href: ''
    },
    {
        id: 7, email: 'ops@urbanfix.com', role: 'staff', imageUrl: '',
        name: '',
        href: ''
    },
    {
        id: 8, email: 'viewer@urbanfix.com', role: 'viewer', imageUrl: '',
        name: '',
        href: ''
    },
  ],
};

// Allowed roles for dialog
const ROLE_OPTIONS = ['consultant', 'admin', 'staff', 'viewer', 'approver', 'account'];

export default function VendorPeoplePage() {
  const methods = useForm();
  const [team, setTeam] = useState<Person[]>([]);
  const [filteredTeam, setFilteredTeam] = useState<Person[]>([]);
  // Keep a string value for the select to avoid undefined→string TS errors
  const [vendorId, setVendorId] = useState<string>(String(mockVendors[0].id));
  const [vendorOptions] = useState<{ value: string; label: string }[]>(
    mockVendors.map(v => ({ value: String(v.id), label: v.name }))
  );
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  // Load mock team when vendor changes
  useEffect(() => {
    const numericId = Number(vendorId);
    const initial = (mockTeamByVendor[numericId] || []).map(p => ({ ...p }));
    setTeam(initial);
    setFilteredTeam(initial);
  }, [vendorId]);

  // Invite a team member by email (mock)
  const handleInvite = async () => {
    if (!vendorId) {
      toast.error('Please select a vendor first.');
      return;
    }
    const email = String(methods.getValues('search') || '').trim().toLowerCase();
    if (!email) {
      toast.error('Enter a valid email to invite.');
      return;
    }
    // Prevent duplicates
    if (team.some(p => (p.email || '').toLowerCase() === email)) {
      toast('This user is already on the team.');
      return;
    }
    const newPerson: Person = {
        id: Math.max(0, ...team.map(p => Number(p.id))) + 1,
        email,
        role: 'viewer',
        imageUrl: '',
        name: '',
        href: ''
    };
    const nextTeam = [...team, newPerson];
    setTeam(nextTeam);
    setFilteredTeam(nextTeam);
    toast.success('Invitation (mock) sent!');
  };

  // Assign role (mock)
  const openAssignRoleDialog = (person: Person) => {
    setSelectedPerson(person);
    setShowRoleDialog(true);
  };
  const onConfirmAssignRole = async (newRole: string) => {
    if (!selectedPerson) return;
    const next = team.map(p => (p.id === selectedPerson.id ? { ...p, role: newRole } : p));
    setTeam(next);
    setFilteredTeam(next);
    setShowRoleDialog(false);
    toast.success(`Role updated to ${newRole}`);
  };

  // Remove person (mock)
  const handleRemove = async (person: Person) => {
    const next = team.filter(p => p.id !== person.id);
    setTeam(next);
    setFilteredTeam(next);
    toast.success('Member removed');
  };

  return (
    <FormProvider {...methods}>
      <LayoutWithoutSidebar shiftY="-translate-y-0">
        <Heading level={5} align="left" bold>
          Vendor Team Management
        </Heading>

        <Spacing size="lg" />

        <SelectField
          id="vendorName"
          name="vendorName"
          label="Vendor"
          options={vendorOptions}
          value={vendorId}                       // always a string
          onChange={(e) => setVendorId(String((e as any).target?.value ?? e))}
        />

        <Spacing size="lg" />

        <InputText
          id="search"
          name="search"
          label="Add team member"
          type="email"
          placeholder="Enter email address to invite"
          icon={MagnifyingGlassIcon}
          rightElement={
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="bg-transparent shadow-none px-3 py-1 text-sm text-indigo-600 hover:bg-indigo-50"
              onClick={handleInvite}
              disabled={!vendorId}
            >
              Invite
            </Button>
          }
        />

        <Spacing size="lg" />
        <LineSeparator />

        <PersonList
          people={filteredTeam}
          onAssignRole={(person) => openAssignRoleDialog(person)}
          onRemove={(person) => handleRemove(person)}
        />

        <ConfirmSelectDialog
          isOpen={showRoleDialog}
          title="Assign New Role"
          message={`Assign a new role for ${selectedPerson?.email}`}
          options={ROLE_OPTIONS}
          defaultValue={selectedPerson?.role}
          onConfirm={onConfirmAssignRole}
          onClose={() => setShowRoleDialog(false)}
        />
      </LayoutWithoutSidebar>
    </FormProvider>
  );
}