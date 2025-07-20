import { Profile } from '@/components/types/Profile';
import toast from 'react-hot-toast';
import { updateTeamMemberRole, fetchTeamMembers, removeTeamMember } from 'todo/services/api';
import { Person } from '../data/StaffList';

export type UserRole = 'consultant' | 'admin' | 'staff' | 'viewer' | 'approver' | 'account';
const currentUserRole: UserRole = 'consultant';

const rolePermissions: Record<UserRole, string[]> = {
  consultant: ['download', 'pay', 'remove', 'assign'],
  admin: ['download', 'assign'],
  staff: ['download'],
  viewer: [],
  approver: ['pay'],
  account: ['download', 'pay'],
};

function hasPermission(action: string): boolean {
  return rolePermissions[currentUserRole]?.includes(action.toLowerCase());
}

function confirmAction(message: string): boolean {
  return window.confirm(message);
}

// Action handlers
export function handleDownload(profile: Profile) {
  if (!hasPermission('download')) return alert('You do not have permission to download.');
  if (!confirmAction(`Download for ${profile.name}?`)) return;
  alert(`Downloading for ${profile.name}`);
}

export function handlePay(profile: Profile) {
  if (!hasPermission('pay')) return alert('You do not have permission to pay.');
  if (!confirmAction(`Pay for ${profile.name}?`)) return;
  alert(`Processing payment for ${profile.name}`);
}

export const handleAssignRole = async (
  person: Person,
  newRole: string,
  businessId: number,
  setTeam: React.Dispatch<React.SetStateAction<Person[]>>,
  setFilteredTeam: React.Dispatch<React.SetStateAction<Person[]>>
) => {
  if (!hasPermission('assign')) {
    toast.error('You do not have permission to assign roles.');
    return;
  }

  if (!newRole || newRole === person.role) return;

  try {
    await updateTeamMemberRole(person.id, newRole);
    toast.success(`Role updated for ${person.email}`);
    const updatedTeam = await fetchTeamMembers(businessId);
    setTeam(updatedTeam);
    setFilteredTeam(updatedTeam);
  } catch (err) {
    console.error('Failed to update role', err);
    toast.error('Failed to update role');
  }
};

export const handleRemove = async (
  person: Person,
  businessId: number,
  setTeam: React.Dispatch<React.SetStateAction<Person[]>>,
  setFilteredTeam: React.Dispatch<React.SetStateAction<Person[]>>
) => {
  if (!hasPermission('remove')) return alert('You do not have permission to remove.');
  if (!confirm(`Remove ${person.email} from the team?`)) return;

  try {
    await removeTeamMember(person.id);
    toast.success(`${person.email} has been removed`);
    const updatedTeam = await fetchTeamMembers(businessId);
    setTeam(updatedTeam);
    setFilteredTeam(updatedTeam);
  } catch (err) {
    console.error('Failed to remove member', err);
    toast.error('Failed to remove member');
  }
};
