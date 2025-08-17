import { useEffect, useState } from 'react';
import PersonList from '@/components/staff/StaffList';
import { Person } from '@/components/data/StaffList';
import { FormProvider, useForm } from 'react-hook-form';
import Heading from '../forms/Heading';
import Spacing from '../forms/Spacing';
import LayoutWithoutSidebar from '../main/LayoutWithoutSidebar';
import { businessNameOptions } from '../data/SelectionList';
import SelectField from '../forms/SelectField';
import InputText from '../forms/InputText';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import LineSeparator from '../forms/LineSeparator';
import Button from '../forms/Button';
import toast from 'react-hot-toast';
import { fetchMyBusinesses, fetchTeamMembers, inviteTeamMember } from 'todo/services/api';
import { handleAssignRole, handleRemove } from '../actions/actionHandler';
import ConfirmSelectDialog from '../forms/ConfirmSelectDialog';
export default function PeoplePage() {
    const methods = useForm();
    const [team, setTeam] = useState<Person[]>([]);
    const [filteredTeam, setFilteredTeam] = useState<Person[]>([]);
    const [businessId, setBusinessId] = useState<number | null>(null);
    const [businessOptions, setBusinessOptions] = useState<{ value: number; label: string }[]>([]);
    const [showRoleDialog, setShowRoleDialog] = useState(false);
    const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

    useEffect(() => {
        fetchMyBusinesses()
            .then((data) => {
                if (!data || data.length === 0) {
                    toast.error('No businesses found. Please create a business first.');
                    return;
                }

                const submittedOnly = (data as any[]).filter((biz) => (deriveStatus(biz) || '') === 'submitted');

                if (submittedOnly.length === 0) {
                    toast.error('No submitted businesses available.');
                }

                const options = submittedOnly.map((biz: any) => ({
                    value: biz.id,
                    label: biz.name || biz.companyName || `#${biz.id}`,
                }));
                setBusinessOptions(options);
            })
            .catch((err) => console.error('Failed to fetch businesses', err));
    }, []);

    useEffect(() => {
        if (businessId) {
            fetchTeamMembers(businessId)
                .then((data) => {
                    setTeam(data);
                    setFilteredTeam(data);
                })
                .catch(console.error);
        }
    }, [businessId]);

    const handleInvite = async () => {
        if (!businessId) {
            toast.error('Please select a business first.');
            return;
        }
        console.log('Inviting team member to business ID:', businessId);
        const email = methods.getValues('search')?.toLowerCase();
        if (!email) return;

        try {
            await inviteTeamMember(businessId!, email);
            toast.success('Invitation sent!');
            const updatedTeam = await fetchTeamMembers(businessId!);
            setTeam(updatedTeam);
            setFilteredTeam(updatedTeam);
        } catch (error) {
            toast.error('Failed to send invite');
        }
    };

    const openAssignRoleDialog = (person: Person) => {
        setSelectedPerson(person);
        setShowRoleDialog(true);
    };

    const onConfirmAssignRole = async (newRole: string) => {
        if (!selectedPerson || !businessId) return;
        await handleAssignRole(selectedPerson, newRole, businessId, setTeam, setFilteredTeam);
        setShowRoleDialog(false);
    };

    return (
        <FormProvider {...methods}>
            <LayoutWithoutSidebar shiftY="-translate-y-0">
                <Heading level={5} align="left" bold>
                    Business Team Management
                </Heading>

                <Spacing size="lg" />

                <SelectField
                    id="businessName"
                    name="businessName"
                    label="Business Name"
                    options={businessOptions}
                    onChange={(e) => setBusinessId(Number(e.target.value))}
                />

                <Spacing size="lg" />

                <InputText
                    id="search"
                    name="search"
                    label="Add staff member"
                    type="email"
                    placeholder="Search by registered email address"
                    icon={MagnifyingGlassIcon}
                    rightElement={
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="bg-transparent shadow-none px-3 py-1 text-sm text-indigo-600 hover:bg-indigo-50"
                            onClick={handleInvite}
                        //disabled={!businessId}  // ✅ Prevents invite if business is not selected
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
                    onRemove={(person) => handleRemove(person, businessId!, setTeam, setFilteredTeam)}
                />
                <ConfirmSelectDialog
                    isOpen={showRoleDialog}
                    title="Assign New Role"
                    message={`Assign a new role for ${selectedPerson?.email}`}
                    options={['consultant', 'admin', 'staff', 'viewer', 'approver', 'account']}
                    defaultValue={selectedPerson?.role}
                    onConfirm={onConfirmAssignRole}
                    onClose={() => setShowRoleDialog(false)}
                />
            </LayoutWithoutSidebar>
        </FormProvider>
    );
}

// --- helpers ---
function deriveStatus(item: any): string | undefined {
    const direct =
        item?.status ||
        item?.applicationStatus ||
        item?.approvalStatus ||
        item?.statusName ||
        item?.currentStatus ||
        item?.state ||
        item?.application_status ||
        item?.approval_status ||
        item?.status_name ||
        item?.current_status;
    if (typeof direct === 'string') return direct.toLowerCase();
    for (const [k, v] of Object.entries(item || {})) {
        if (typeof v === 'string' && /status/i.test(k)) return v.toLowerCase();
    }
    return undefined;
}

