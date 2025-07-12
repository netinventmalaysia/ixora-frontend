import { Profile } from '@/components/types/Profile';

export type UserRole = 'consultant' | 'admin' | 'staff' | 'viewer';
const currentUserRole: UserRole = 'consultant';

const rolePermissions: Record<UserRole, string[]> = {
  consultant: ['download', 'pay', 'remove', 'assign'],
  admin: ['download', 'assign'],
  staff: ['download'],
  viewer: [],
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

export function handleAssignRole(profile: Profile, setProfiles: React.Dispatch<React.SetStateAction<Profile[]>>) {
  if (!hasPermission('assign')) return alert('You do not have permission to assign roles.');
  const newRole = prompt(`Assign new role to ${profile.name}:`, profile.role);
  if (newRole) {
    setProfiles((prev) =>
      prev.map((p) => (p.email === profile.email ? { ...p, role: newRole } : p))
    );
  }
}

export function handleRemove(profile: Profile, setProfiles: React.Dispatch<React.SetStateAction<Profile[]>>) {
  if (!hasPermission('remove')) return alert('You do not have permission to remove.');
  if (confirm(`Remove ${profile.name}?`)) {
    setProfiles((prev) => prev.filter((p) => p.email !== profile.email));
  }
}